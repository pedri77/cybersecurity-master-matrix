/**
 * data.js — Shared data loader and utilities
 * Used by all pages in the Cybersecurity Master Matrix v0.5.1
 */

// Singleton DB cache
let _db = null;

/**
 * Load matrix.json (cached after first call)
 */
async function loadDB(basePath = '') {
  if (_db) return _db;
  const res = await fetch(basePath + 'data/matrix.json');
  if (!res.ok) throw new Error('Failed to load data (' + res.status + ')');
  _db = await res.json();
  return _db;
}

/** Escape HTML entities */
function esc(str) {
  return String(str ?? '').replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[c]));
}

/** Create a URL-safe slug from a string */
function slugify(str) {
  return String(str ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Product slug: provider-product combined */
function productSlug(product) {
  return slugify(product.Proveedor + ' ' + product.Producto);
}

// --- Lookup functions ---

/** Get providers for a category ID */
function providersForCategory(db, categoryId) {
  return db.map
    .filter(m => m['ID categoría'] === categoryId)
    .map(m => m['Proveedor representativo']);
}

/** Get categories for a domain ID */
function categoriesForDomain(db, domainId) {
  return db.categories.filter(c => c['ID dominio'] === domainId);
}

/** Get categories for a provider name */
function categoriesForProvider(db, providerName) {
  const catIds = db.map
    .filter(m => m['Proveedor representativo'] === providerName)
    .map(m => m['ID categoría']);
  const unique = [...new Set(catIds)];
  return unique.map(id => db.categories.find(c => c['ID categoría'] === id)).filter(Boolean);
}

/** Get products for a category ID */
function productsForCategory(db, categoryId) {
  return (db.products || []).filter(p => p['ID categoría'] === categoryId);
}

/** Get products for a provider name (deduplicated by product name) */
function productsForProvider(db, providerName) {
  return (db.products || []).filter(p => p.Proveedor === providerName);
}

/** Get unique products for a provider (one row per product name) */
function uniqueProductsForProvider(db, providerName) {
  const all = productsForProvider(db, providerName);
  const seen = new Set();
  return all.filter(p => {
    if (seen.has(p.Producto)) return false;
    seen.add(p.Producto);
    return true;
  });
}

/** Find product by slug (first match) */
function findProductBySlug(db, slug) {
  return (db.products || []).find(p => productSlug(p) === slug);
}

/** Get all rows for a product (same provider+name, different categories) */
function allProductRows(db, product) {
  return (db.products || []).filter(p =>
    p.Proveedor === product.Proveedor && p.Producto === product.Producto
  );
}

/** Find a domain by ID */
function findDomain(db, id) {
  return db.domains.find(d => d.ID === id);
}

/** Find a category by ID */
function findCategory(db, id) {
  return db.categories.find(c => c['ID categoría'] === id);
}

/** Find a provider by slug */
function findProviderBySlug(db, slug) {
  return db.providers.find(p => slugify(p.Proveedor) === slug);
}

/** Find a provider by exact name */
function findProviderByName(db, name) {
  return db.providers.find(p => p.Proveedor === name);
}

/** Get capability definitions */
function getCapabilities(db) {
  return db.capabilities || [];
}

/** Get product capability values (returns object with CAP001-CAP020 keys, or null) */
function getProductCapabilities(db, providerName, productName) {
  return (db.productCapabilities || []).find(
    pc => pc.Proveedor === providerName && pc.Producto === productName
  ) || null;
}

/** Check if product has capability data populated */
function hasCapabilityData(db, providerName, productName) {
  return getProductCapabilities(db, providerName, productName) !== null;
}

/** Count how many capabilities are populated for a product */
function capabilityFillCount(db, providerName, productName) {
  const pc = getProductCapabilities(db, providerName, productName);
  if (!pc) return 0;
  let count = 0;
  for (let i = 1; i <= 20; i++) {
    const key = 'CAP' + String(i).padStart(3, '0');
    if (pc[key] && pc[key].trim()) count++;
  }
  return count;
}

/** Get product details (granular data) */
function getProductDetails(db, providerName, productName) {
  return (db.productDetails || []).filter(
    d => d.Proveedor === providerName && d.Producto === productName
  );
}

/** Build domain select options */
function fillDomainSelect(db, selectEl) {
  selectEl.innerHTML = '<option value="">Todos los dominios</option>' +
    db.domains.map(d => `<option value="${esc(d.ID)}">${esc(d.Dominio)}</option>`).join('');
}

// --- Render shared components ---

/** Render shared nav bar */
function renderNav(activePage) {
  const pages = [
    { href: 'index.html', label: 'Inicio', id: 'home' },
    { href: 'domains.html', label: 'Dominios', id: 'domains' },
    { href: 'categories.html', label: 'Categorias', id: 'categories' },
    { href: 'providers.html', label: 'Proveedores', id: 'providers' },
    { href: 'products.html', label: 'Productos', id: 'products' },
    { href: 'compare.html', label: 'Comparar', id: 'compare' },
    { href: 'ranking.html', label: 'Ranking', id: 'ranking' },
    { href: 'methodology.html', label: 'Metodologia', id: 'methodology' }
  ];

  return `
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <nav class="nav">
      <div class="container">
        <a href="index.html" class="nav-brand">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> CyberMatrix
        </a>
        <div class="nav-search-wrapper">
          <input type="search" id="global-search" class="nav-search" placeholder="Buscar..." autocomplete="off">
          <div id="global-search-results" class="global-search-results"></div>
        </div>
        <button class="nav-toggle" onclick="document.querySelector('.nav-links').classList.toggle('open')" aria-label="Menu">&#9776;</button>
        <div class="nav-links">
          ${pages.map(p =>
            `<a href="${p.href}" class="${activePage === p.id ? 'active' : ''}">${p.label}</a>`
          ).join('')}
        </div>
      </div>
    </nav>`;
}

/** Render shared footer */
function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-disclaimer">Los datos de esta matriz son orientativos y estan pendientes de validacion independiente. No sustituyen la evaluacion directa de cada producto. <a href="https://github.com/pedri77/cybersecurity-master-matrix/blob/main/CONTRIBUTING.md">Contribuir con correcciones</a>.</div>
        <div class="footer-bottom">
          <span>Cybersecurity Master Matrix v1.0</span>
          <span>Datos en <a href="data/matrix.json">JSON</a> y <a href="data/">CSV</a> · <a href="https://github.com/pedri77/cybersecurity-master-matrix">GitHub</a></span>
        </div>
      </div>
    </footer>
    <button class="back-to-top" id="btt" onclick="window.scrollTo({top:0})" aria-label="Volver arriba">&#8593;</button>`;
}

// Back-to-top visibility + global search init
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('btt');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Init global search once DOM is ready and data loaded
  window.addEventListener('DOMContentLoaded', () => {
    // Wait for init() to complete (which loads DB and renders nav)
    const check = setInterval(() => {
      if (_db && document.getElementById('global-search')) {
        clearInterval(check);
        initGlobalSearch();
      }
    }, 100);
  });
}

/** Global search across all entities */
function initGlobalSearch() {
  const input = document.getElementById('global-search');
  const results = document.getElementById('global-search-results');
  if (!input || !results || !_db) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) { results.innerHTML = ''; results.style.display = 'none'; return; }

    const hits = [];
    const max = 12;

    // Search products (unique)
    const seenP = new Set();
    for (const p of _db.products) {
      if (hits.length >= max) break;
      const key = p.Proveedor + '|' + p.Producto;
      if (seenP.has(key)) continue;
      seenP.add(key);
      if ((p.Producto + ' ' + p.Proveedor).toLowerCase().includes(q)) {
        hits.push({ type: 'Producto', label: p.Producto, sub: p.Proveedor, href: 'product.html#' + productSlug(p) });
      }
    }

    // Search providers
    for (const p of _db.providers) {
      if (hits.length >= max) break;
      if (p.Proveedor.toLowerCase().includes(q)) {
        hits.push({ type: 'Proveedor', label: p.Proveedor, sub: (p.Tier || '') + ' · ' + p['N.º categorías'] + ' cats', href: 'provider.html#' + slugify(p.Proveedor) });
      }
    }

    // Search categories
    for (const c of _db.categories) {
      if (hits.length >= max) break;
      if ((c['Categoría tecnológica'] + ' ' + c.Dominio).toLowerCase().includes(q)) {
        hits.push({ type: 'Categoria', label: c['Categoría tecnológica'], sub: c.Dominio, href: 'category.html#' + c['ID categoría'] });
      }
    }

    // Search domains
    for (const d of _db.domains) {
      if (hits.length >= max) break;
      if ((d.Dominio + ' ' + d.Alcance).toLowerCase().includes(q)) {
        hits.push({ type: 'Dominio', label: d.Dominio, sub: d.Alcance, href: 'domain.html#' + d.ID });
      }
    }

    if (!hits.length) {
      results.innerHTML = '<div class="gs-empty">Sin resultados</div>';
      results.style.display = 'block';
      return;
    }

    results.innerHTML = hits.map((h, i) =>
      '<a class="gs-item" href="' + h.href + '" role="option" data-idx="' + i + '">' +
      '<span class="gs-type">' + h.type + '</span>' +
      '<span class="gs-label">' + esc(h.label) + '</span>' +
      '<span class="gs-sub">' + esc(h.sub) + '</span>' +
      '</a>'
    ).join('');
    results.setAttribute('role', 'listbox');
    results.style.display = 'block';
    _gsIndex = -1;
  });

  // Keyboard nav: arrows + enter
  let _gsIndex = -1;
  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.gs-item');
    if (!items.length || results.style.display === 'none') {
      if (e.key === 'Escape') { results.style.display = 'none'; input.blur(); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _gsIndex = Math.min(_gsIndex + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('gs-active', i === _gsIndex));
      items[_gsIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _gsIndex = Math.max(_gsIndex - 1, 0);
      items.forEach((el, i) => el.classList.toggle('gs-active', i === _gsIndex));
      items[_gsIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && _gsIndex >= 0) {
      e.preventDefault();
      items[_gsIndex].click();
    } else if (e.key === 'Escape') {
      results.style.display = 'none';
      input.blur();
    }
  });

  // Close on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search-wrapper')) {
      results.style.display = 'none';
    }
  });
}

/** Export data as CSV file download */
function exportCSV(filename, headers, rows) {
  const csvContent = [headers.join(',')]
    .concat(rows.map(row =>
      row.map(cell => {
        const s = String(cell ?? '');
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? '"' + s.replace(/"/g, '""') + '"'
          : s;
      }).join(',')
    )).join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Pagination helper */
function paginate(items, page, perPage) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: p,
    totalPages: totalPages,
    total: total
  };
}

/** Render pagination controls */
function renderPagination(page, totalPages, onPageChange) {
  if (totalPages <= 1) return '';

  const buttons = [];
  buttons.push('<button class="page-btn' + (page <= 1 ? ' disabled' : '') + '" data-page="' + (page - 1) + '">&laquo;</button>');

  // Show max 7 page buttons
  let start = Math.max(1, page - 3);
  let end = Math.min(totalPages, start + 6);
  if (end - start < 6) start = Math.max(1, end - 6);

  for (let i = start; i <= end; i++) {
    buttons.push('<button class="page-btn' + (i === page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>');
  }

  buttons.push('<button class="page-btn' + (page >= totalPages ? ' disabled' : '') + '" data-page="' + (page + 1) + '">&raquo;</button>');

  const id = 'pagination-' + Math.random().toString(36).slice(2, 8);
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.querySelectorAll('.page-btn:not(.disabled)').forEach(btn => {
      btn.onclick = () => onPageChange(parseInt(btn.dataset.page));
    });
  }, 0);

  return '<div class="pagination" id="' + id + '">' + buttons.join('') + '</div>';
}

/** Copy text to clipboard with feedback */
function copyToClipboard(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btnEl.textContent;
    btnEl.textContent = 'Copiado';
    setTimeout(() => { btnEl.textContent = orig; }, 1500);
  });
}

/** Animate counter from 0 to target */
function animateCounters() {
  document.querySelectorAll('.stat strong').forEach(el => {
    const target = parseInt(el.textContent.replace(/\D/g, ''));
    if (isNaN(target) || target === 0) return;
    const duration = 800;
    const start = performance.now();
    el.textContent = '0';
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/** Show disclaimer banner on first visit */
function showDisclaimerBanner() {
  if (sessionStorage.getItem('disclaimer-seen')) return;
  const banner = document.createElement('div');
  banner.className = 'disclaimer-banner';
  banner.innerHTML = '<span>Los datos de esta matriz son orientativos y pendientes de validacion independiente.</span>' +
    '<button onclick="this.parentElement.remove();sessionStorage.setItem(\'disclaimer-seen\',\'1\')">Entendido</button>';
  document.body.prepend(banner);
}

/** Render breadcrumbs */
function renderBreadcrumbs(items) {
  return `
    <nav class="breadcrumbs">
      ${items.map((item, i) => {
        if (i === items.length - 1) {
          return `<span class="current">${esc(item.label)}</span>`;
        }
        return `<a href="${item.href}">${esc(item.label)}</a><span class="sep">/</span>`;
      }).join('')}
    </nav>`;
}

/** Render stat cards */
function renderStats(db) {
  const m = db.meta;
  const items = [
    ['Dominios', m.domains],
    ['Categorias', m.categories],
    ['Proveedores', m.providers],
    ['Productos', m.unique_products || 0]
  ];
  return items.map(([label, value]) =>
    `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`
  ).join('');
}

/** Priority badge HTML */
function priorityBadge(priority) {
  return `<span class="badge priority-${esc(priority)}">${esc(priority)}</span>`;
}

/** Maturity badge HTML */
function maturityBadge(maturity) {
  return `<span class="badge maturity-${esc(maturity)}">${esc(maturity)}</span>`;
}

/** Tier badge HTML */
function tierBadge(tier) {
  const cls = {
    'Tier 1': 'tier-1',
    'Tier 2': 'tier-2',
    'Tier 3': 'tier-3'
  }[tier] || '';
  return `<span class="badge ${cls}">${esc(tier)}</span>`;
}

/** Get sources for a product */
function getProductSources(db, providerName, productName) {
  return (db.productSources || []).filter(
    s => s.Proveedor === providerName && s.Producto === productName
  );
}

/** Get product URL (from first matching row) */
function getProductURL(db, providerName, productName) {
  const p = (db.products || []).find(
    p => p.Proveedor === providerName && p.Producto === productName && p.URL && p.URL.trim()
  );
  return p ? p.URL.trim() : '';
}

/** Deployment badge HTML */
function deployBadge(deploy) {
  const cls = {
    'SaaS': 'deploy-saas',
    'On-prem': 'deploy-onprem',
    'Híbrido': 'deploy-hybrid',
    'Cloud': 'deploy-cloud',
    'Appliance': 'deploy-appliance'
  }[deploy] || '';
  return `<span class="badge ${cls}">${esc(deploy)}</span>`;
}
