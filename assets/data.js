/**
 * data.js — Shared data loader and utilities
 * Used by all pages in the Cybersecurity Master Matrix v0.3
 */

// Singleton DB cache
let _db = null;

/**
 * Load matrix.json (cached after first call)
 */
async function loadDB(basePath = '') {
  if (_db) return _db;
  const res = await fetch(basePath + 'data/matrix.json');
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

/** Get capabilities for a category (by domain) */
function capabilitiesForCategory(db, category) {
  return db.capabilities || [];
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
    { href: 'products.html', label: 'Productos', id: 'products' }
  ];

  return `
    <nav class="nav">
      <div class="container">
        <a href="index.html" class="nav-brand">
          <span class="icon">&#x1f6e1;</span> CyberMatrix
        </a>
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
        <span>Cybersecurity Master Matrix v0.3</span>
        <span>Datos en <a href="data/matrix.json">JSON</a> y <a href="data/">CSV</a></span>
      </div>
    </footer>`;
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
