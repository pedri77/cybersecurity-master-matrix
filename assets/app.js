/**
 * app.js — Homepage (index.html)
 * Shows stats + 3 entry cards to domains, categories, providers
 */

async function init() {
  const db = await loadDB();

  // Render nav + footer
  document.getElementById('nav-slot').innerHTML = renderNav('home');
  document.getElementById('footer-slot').innerHTML = renderFooter();

  // Stats
  document.getElementById('stats').innerHTML = renderStats(db);

  // Entry card counts
  document.getElementById('count-domains').textContent =
    `${db.meta.domains} dominios`;
  document.getElementById('count-categories').textContent =
    `${db.meta.categories} categorias tecnologicas`;
  document.getElementById('count-providers').textContent =
    `${db.meta.providers} proveedores`;
  document.getElementById('count-products').textContent =
    `${db.meta.unique_products || 0} productos`;

  // Recent / highlight: top 5 high-priority categories
  const highlights = db.categories
    .filter(c => c.Prioridad === 'Alta')
    .slice(0, 6);

  document.getElementById('highlights').innerHTML = `
    <div class="grid">
      ${highlights.map(c => {
        const providers = providersForCategory(db, c['ID categoría']);
        return `
          <a class="card" href="category.html#${esc(c['ID categoría'])}">
            <div class="eyebrow">${esc(c.Dominio)}</div>
            <h3>${esc(c['Categoría tecnológica'])}</h3>
            <p>${esc(c.Objetivo)}</p>
            <div class="card-meta">
              ${priorityBadge(c.Prioridad)}
              <span class="badge">${providers.length} proveedores</span>
            </div>
          </a>`;
      }).join('')}
    </div>`;
}

init();
