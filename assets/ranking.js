    let db;
    const defaultWeights = { cats: 5, doms: 3, priority: 5, niche: 2, provider: 3, confidence: 4 };

    async function init() {
      try {
      db = await loadDB();
      document.getElementById('nav-slot').innerHTML = renderNav('ranking');
      document.getElementById('footer-slot').innerHTML = renderFooter();

      // Fill selects
      fillDomainSelect(db, document.getElementById('f-domain'));
      fillCategorySelect();

      // Bind events
      ['f-category', 'f-domain', 'f-deploy', 'f-min-cats'].forEach(id => {
        document.getElementById(id).addEventListener('change', render);
      });

      ['w-cats', 'w-doms', 'w-priority', 'w-niche', 'w-provider', 'w-confidence'].forEach(id => {
        const slider = document.getElementById(id);
        const valEl = document.getElementById('wv-' + id.split('-')[1]);
        slider.addEventListener('input', () => {
          valEl.textContent = slider.value;
          render();
        });
      });

      document.getElementById('btn-reset-weights').onclick = () => {
        Object.entries(defaultWeights).forEach(([k, v]) => {
          document.getElementById('w-' + k).value = v;
          document.getElementById('wv-' + k).textContent = v;
        });
        render();
      };

      render();
      } catch (err) {
        console.error('Init error:', err);
        document.getElementById('content')?.classList.remove('loading');
        alert('Error loading data: ' + err.message);
      }
    }

    function fillCategorySelect() {
      const sel = document.getElementById('f-category');
      sel.innerHTML = '<option value="">Todas las categorias</option>' +
        db.categories.map(c =>
          '<option value="' + esc(c['ID categoría']) + '">' + esc(c['Categoría tecnológica']) + '</option>'
        ).join('');
    }

    function getWeights() {
      return {
        cats: parseInt(document.getElementById('w-cats').value),
        doms: parseInt(document.getElementById('w-doms').value),
        priority: parseInt(document.getElementById('w-priority').value),
        niche: parseInt(document.getElementById('w-niche').value),
        provider: parseInt(document.getElementById('w-provider').value),
        confidence: parseInt(document.getElementById('w-confidence').value)
      };
    }

    function getFilters() {
      return {
        category: document.getElementById('f-category').value,
        domain: document.getElementById('f-domain').value,
        deploy: document.getElementById('f-deploy').value,
        minCats: parseInt(document.getElementById('f-min-cats').value)
      };
    }

    function render() {
      const filters = getFilters();
      const weights = getWeights();

      // Build unique product list
      const seen = new Set();
      let products = (db.products || []).filter(p => {
        const key = p.Proveedor + '|' + p.Producto;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Enrich each product
      let enriched = products.map(p => {
        const rows = allProductRows(db, p);
        const cats = rows.map(r => findCategory(db, r['ID categoría'])).filter(Boolean);
        const catIds = cats.map(c => c['ID categoría']);
        const domainIds = [...new Set(cats.map(c => c['ID dominio']))];
        const domains = domainIds.map(id => findDomain(db, id)).filter(Boolean);
        const highPriority = cats.filter(c => c.Prioridad === 'Alta').length;
        const provider = findProviderByName(db, p.Proveedor);

        // Peer count
        const peerSet = new Set();
        rows.forEach(r => {
          productsForCategory(db, r['ID categoría']).forEach(cp => {
            if (cp.Proveedor !== p.Proveedor) peerSet.add(cp.Proveedor + '|' + cp.Producto);
          });
        });

        return {
          product: p,
          slug: productSlug(p),
          cats: cats,
          catIds: catIds,
          domains: domains,
          domainCount: domains.length,
          catCount: cats.length,
          highPriority: highPriority,
          peerCount: peerSet.size,
          providerCats: provider ? parseInt(provider['N.º categorías']) || 0 : 0,
          capFill: capabilityFillCount(db, p.Proveedor, p.Producto),
          excluded: false,
          reason: ''
        };
      });

      // Apply eliminatory filters
      enriched.forEach(e => {
        if (filters.deploy && e.product.Despliegue !== filters.deploy) {
          e.excluded = true;
          e.reason = 'Despliegue: ' + e.product.Despliegue;
        }
        if (filters.domain && !e.domains.some(d => d.ID === filters.domain)) {
          e.excluded = true;
          e.reason = 'Fuera de dominio';
        }
        if (filters.category && !e.catIds.includes(filters.category)) {
          e.excluded = true;
          e.reason = 'No cubre categoria';
        }
        if (filters.minCats > 0 && e.catCount < filters.minCats) {
          e.excluded = true;
          e.reason = 'Solo ' + e.catCount + ' categorias';
        }
      });

      // Compute scores for non-excluded
      const eligible = enriched.filter(e => !e.excluded);

      if (eligible.length) {
        // Normalize values 0-1
        const maxCats = Math.max(...eligible.map(e => e.catCount));
        const maxDoms = Math.max(...eligible.map(e => e.domainCount));
        const maxHigh = Math.max(...eligible.map(e => e.highPriority));
        const maxPeers = Math.max(...eligible.map(e => e.peerCount));
        const maxProvCats = Math.max(...eligible.map(e => e.providerCats));

        const totalWeight = weights.cats + weights.doms + weights.priority + weights.niche + weights.provider + weights.confidence;

        eligible.forEach(e => {
          if (totalWeight === 0) { e.score = 0; return; }

          const normCats = maxCats ? e.catCount / maxCats : 0;
          const normDoms = maxDoms ? e.domainCount / maxDoms : 0;
          const normHigh = maxHigh ? e.highPriority / maxHigh : 0;
          const normNiche = maxPeers ? 1 - (e.peerCount / maxPeers) : 1;
          const normProv = maxProvCats ? e.providerCats / maxProvCats : 0;
          const normConf = e.capFill / 20; // 0-1 based on 20 total capabilities

          e.score = Math.round(
            ((normCats * weights.cats +
              normDoms * weights.doms +
              normHigh * weights.priority +
              normNiche * weights.niche +
              normProv * weights.provider +
              normConf * weights.confidence) / totalWeight) * 100
          );
        });

        // Sort by score descending
        eligible.sort((a, b) => b.score - a.score);
      }

      // Show count
      const excluded = enriched.filter(e => e.excluded);
      document.getElementById('resultCount').textContent =
        eligible.length + ' productos elegibles' +
        (excluded.length ? ' · ' + excluded.length + ' eliminados' : '');

      if (!eligible.length) {
        document.getElementById('ranking').innerHTML =
          '<div class="empty panel">Ningun producto cumple los filtros. Relaja los criterios.</div>';
        return;
      }

      // Render table (top 50)
      const top = eligible.slice(0, 50);

      const rows = top.map((e, i) => {
        const rank = i + 1;
        const rankClass = rank <= 3 ? ' rank-' + rank : '';
        const barColor = e.score >= 70 ? 'var(--success)' : e.score >= 40 ? 'var(--accent)' : 'var(--warning)';

        return '<tr>' +
          '<td><span class="rank-number' + rankClass + '">' + rank + '</span></td>' +
          '<td><a href="product.html#' + e.slug + '">' + esc(e.product.Producto) + '</a></td>' +
          '<td><a href="provider.html#' + slugify(e.product.Proveedor) + '">' + esc(e.product.Proveedor) + '</a></td>' +
          '<td>' + deployBadge(e.product.Despliegue) + '</td>' +
          '<td>' + e.catCount + '</td>' +
          '<td>' + e.domainCount + '</td>' +
          '<td>' + e.highPriority + '</td>' +
          '<td>' + (e.capFill > 0 ? '<strong>' + e.capFill + '</strong>/20' : '<span class="no-match">—</span>') + '</td>' +
          '<td><div class="score-bar-cell">' +
            '<div class="score-bar"><div class="score-bar-fill" style="width:' + e.score + '%;background:' + barColor + '"></div></div>' +
            '<span class="score-value">' + e.score + '</span>' +
          '</div></td>' +
          '</tr>';
      }).join('');

      document.getElementById('ranking').innerHTML =
        '<div class="panel"><div class="table-wrapper">' +
        '<table>' +
        '<thead><tr>' +
        '<th>#</th><th>Producto</th><th>Proveedor</th><th>Despliegue</th>' +
        '<th>Cats</th><th>Doms</th><th>P.Alta</th><th>Datos</th><th>Score</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
        '</table></div></div>';
    }

    init();
