    let db;
    let selected = []; // array of product slugs

    async function init() {
      try {
      db = await loadDB();
      document.getElementById('nav-slot').innerHTML = renderNav('compare');
      document.getElementById('footer-slot').innerHTML = renderFooter();

      // Load from hash
      if (location.hash.length > 1) {
        const slugs = location.hash.slice(1).split(',').filter(Boolean);
        slugs.forEach(s => {
          const p = findProductBySlug(db, s);
          if (p && selected.length < 4 && !selected.includes(s)) {
            selected.push(s);
          }
        });
      }

      setupSearch();
      renderSelected();
      renderComparison();
      } catch (err) {
        console.error('Init error:', err);
        document.getElementById('content')?.classList.remove('loading');
        alert('Error loading data: ' + err.message);
      }
    }

    function updateHash() {
      history.replaceState(null, '', '#' + selected.join(','));
    }

    function addProduct(slug) {
      if (selected.length >= 4 || selected.includes(slug)) return;
      selected.push(slug);
      updateHash();
      renderSelected();
      renderComparison();
      document.getElementById('search').value = '';
      document.getElementById('search-results').style.display = 'none';
    }

    function removeProduct(slug) {
      selected = selected.filter(s => s !== slug);
      updateHash();
      renderSelected();
      renderComparison();
    }

    function clearAll() {
      selected = [];
      updateHash();
      renderSelected();
      renderComparison();
    }

    function setupSearch() {
      const input = document.getElementById('search');
      const results = document.getElementById('search-results');
      const clearBtn = document.getElementById('btn-clear');

      clearBtn.onclick = clearAll;

      // Build unique product list for search
      const seen = new Set();
      const allProducts = (db.products || []).filter(p => {
        const key = p.Proveedor + '|' + p.Producto;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        if (q.length < 2) {
          results.style.display = 'none';
          return;
        }

        const matches = allProducts
          .filter(p => {
            const slug = productSlug(p);
            if (selected.includes(slug)) return false;
            return (p.Producto + ' ' + p.Proveedor).toLowerCase().includes(q);
          })
          .slice(0, 10);

        if (!matches.length) {
          results.style.display = 'none';
          return;
        }

        results.innerHTML = matches.map(p => {
          const slug = productSlug(p);
          return '<div class="search-item" data-slug="' + slug + '">' +
            '<span class="si-product">' + esc(p.Producto) + '</span>' +
            '<span class="si-provider">' + esc(p.Proveedor) + '</span>' +
            '</div>';
        }).join('');

        results.style.display = 'block';

        results.querySelectorAll('.search-item').forEach(el => {
          el.onclick = () => addProduct(el.dataset.slug);
        });
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#search-wrapper')) {
          results.style.display = 'none';
        }
      });
    }

    function renderSelected() {
      const container = document.getElementById('selected');
      const clearBtn = document.getElementById('btn-clear');
      const exportBtn = document.getElementById('btn-export');

      clearBtn.style.display = selected.length > 0 ? 'inline-block' : 'none';
      if (exportBtn) exportBtn.style.display = selected.length >= 2 ? 'inline-block' : 'none';
      const copyBtn = document.getElementById('btn-copy');
      if (copyBtn) copyBtn.style.display = selected.length >= 2 ? 'inline-block' : 'none';

      container.innerHTML = selected.map(slug => {
        const p = findProductBySlug(db, slug);
        if (!p) return '';
        return '<div class="compare-chip">' +
          '<span>' + esc(p.Producto) + ' <small>(' + esc(p.Proveedor) + ')</small></span>' +
          '<span class="chip-remove" data-slug="' + slug + '">&times;</span>' +
          '</div>';
      }).join('');

      container.querySelectorAll('.chip-remove').forEach(el => {
        el.onclick = () => removeProduct(el.dataset.slug);
      });
    }

    function renderComparison() {
      const container = document.getElementById('comparison');

      if (selected.length < 2) {
        container.innerHTML = '<div class="empty panel">' +
          (selected.length === 0
            ? 'Busca y selecciona al menos 2 productos para comparar.'
            : 'Selecciona al menos 1 producto mas para comparar.') +
          '</div>';
        return;
      }

      // Gather data for each product
      const products = selected.map(slug => {
        const p = findProductBySlug(db, slug);
        if (!p) return null;
        const rows = allProductRows(db, p);
        const cats = rows.map(r => findCategory(db, r['ID categoría'])).filter(Boolean);
        const domainIds = [...new Set(cats.map(c => c['ID dominio']))];
        const domains = domainIds.map(id => findDomain(db, id)).filter(Boolean);
        const provider = findProviderByName(db, p.Proveedor);

        // Count peers
        const peerSet = new Set();
        rows.forEach(r => {
          productsForCategory(db, r['ID categoría']).forEach(cp => {
            if (cp.Proveedor !== p.Proveedor) peerSet.add(cp.Proveedor);
          });
        });

        return {
          product: p,
          slug: slug,
          categories: cats,
          domains: domains,
          provider: provider,
          peerCount: peerSet.size
        };
      }).filter(Boolean);

      // All categories across selected products
      const allCatIds = [...new Set(products.flatMap(p => p.categories.map(c => c['ID categoría'])))];
      const allCats = allCatIds.map(id => findCategory(db, id)).filter(Boolean);

      // Build header
      const headerCols = products.map(p =>
        '<th class="product-header">' +
        '<a href="product.html#' + p.slug + '">' + esc(p.product.Producto) + '</a>' +
        '<span class="compare-provider">' + esc(p.product.Proveedor) + '</span>' +
        '</th>'
      ).join('');

      // Build rows
      function row(label, fn) {
        return '<tr><td>' + label + '</td>' +
          products.map(p => '<td>' + fn(p) + '</td>').join('') +
          '</tr>';
      }

      const catRows = allCats.map(cat => {
        return '<tr><td>' + esc(cat['Categoría tecnológica']) + '</td>' +
          products.map(p => {
            const has = p.categories.some(c => c['ID categoría'] === cat['ID categoría']);
            return '<td style="text-align:center;background:' +
              (has ? 'rgba(110,231,168,0.1)' : 'rgba(255,107,107,0.05)') + '">' +
              (has ? '<span class="match">&#10003;</span>' : '<span class="no-match">&#10007;</span>') +
              '</td>';
          }).join('') +
          '</tr>';
      }).join('');

      // Capability comparison rows
      const caps = getCapabilities(db);
      const capRows2 = caps.map(cap => {
        return '<tr><td>' + esc(cap.Capacidad) + '</td>' +
          products.map(p => {
            const pc = getProductCapabilities(db, p.product.Proveedor, p.product.Producto);
            if (!pc) return '<td style="background:rgba(255,107,107,0.05)"><span class="no-match">—</span></td>';
            const val = pc[cap.ID] || '';
            if (!val.trim()) return '<td style="background:rgba(255,107,107,0.05)"><span class="no-match">—</span></td>';
            return '<td style="background:rgba(110,231,168,0.06)">' + val.split(';').map(v => '<span class="badge">' + esc(v.trim()) + '</span>').join(' ') + '</td>';
          }).join('') +
          '</tr>';
      }).join('');

      const sectionSep = function(title) {
        return '<tr><td colspan="' + (products.length + 1) + '" style="padding:16px 14px;color:var(--accent);font-weight:600;font-size:0.88rem;text-transform:uppercase;letter-spacing:0.06em;">' + title + '</td></tr>';
      };

      container.innerHTML =
        '<div class="panel"><div class="table-wrapper">' +
        '<table class="compare-table">' +
        '<thead><tr><th></th>' + headerCols + '</tr></thead>' +
        '<tbody>' +
        sectionSep('General') +
        row('Proveedor', p => '<a href="provider.html#' + slugify(p.product.Proveedor) + '">' + esc(p.product.Proveedor) + '</a>') +
        row('Despliegue', p => deployBadge(p.product.Despliegue)) +
        row('Ediciones', p => '<span style="font-size:0.85rem">' + esc(p.product.Ediciones) + '</span>') +
        row('Categorias', p => '<strong>' + p.categories.length + '</strong>') +
        row('Dominios', p => p.domains.map(d =>
          '<a class="badge" href="domain.html#' + esc(d.ID) + '">' + esc(d.Dominio) + '</a>'
        ).join(' ')) +
        row('Competidores', p => '<strong>' + p.peerCount + '</strong>') +
        row('Datos evaluados', p => {
          const fill = capabilityFillCount(db, p.product.Proveedor, p.product.Producto);
          return fill > 0 ? '<strong>' + fill + '/20</strong>' : '<span class="no-match">Sin datos</span>';
        }) +
        sectionSep('Capacidades') +
        capRows2 +
        sectionSep('Cobertura por categoria') +
        catRows +
        '</tbody></table></div></div>';

      // Store for export
      window._compareProducts = products;
      window._compareCaps = caps;
    }

    function exportComparison() {
      const products = window._compareProducts || [];
      const caps = window._compareCaps || [];
      if (products.length < 2) return;

      const headers = ['Dimension'].concat(products.map(p => p.product.Proveedor + ' - ' + p.product.Producto));
      const rows = [];

      rows.push(['Despliegue'].concat(products.map(p => p.product.Despliegue)));
      rows.push(['Ediciones'].concat(products.map(p => p.product.Ediciones)));
      rows.push(['Categorias'].concat(products.map(p => p.categories.length)));
      rows.push(['Dominios'].concat(products.map(p => p.domains.map(d => d.Dominio).join('; '))));
      rows.push(['Competidores'].concat(products.map(p => p.peerCount)));

      caps.forEach(cap => {
        rows.push([cap.Capacidad].concat(products.map(p => {
          const pc = getProductCapabilities(db, p.product.Proveedor, p.product.Producto);
          return pc ? (pc[cap.ID] || '') : '';
        })));
      });

      exportCSV('cybermatrix-comparacion.csv', headers, rows);
    }

    init();
