# CyberMatrix — Matriz Maestra Global de Ciberseguridad

[![GitHub Pages](https://img.shields.io/badge/demo-live-55c2ff?style=flat-square)](https://pedri77.github.io/cybersecurity-master-matrix/)
[![Data](https://img.shields.io/badge/datos-JSON%20%2B%20CSV-6ee7a8?style=flat-square)](https://pedri77.github.io/cybersecurity-master-matrix/data/matrix.json)
[![License](https://img.shields.io/badge/licencia-CC%20BY%204.0-ffd166?style=flat-square)](LICENSE)

Taxonomia abierta para clasificar mercados, analizar proveedores y construir comparativas tecnologicas de ciberseguridad basadas en evidencias.

**[Ver demo en vivo](https://pedri77.github.io/cybersecurity-master-matrix/)**

## Contenido

| Dimension | Cantidad |
|-----------|----------|
| Dominios estrategicos | 20 |
| Categorias tecnologicas | 122 |
| Proveedores | 343 |
| Productos | 486 |
| Relaciones categoria-proveedor | 668 |
| Productos con capacidades evaluadas | 493 |
| Capacidades de evaluacion | 20 |

## Funcionalidades

- **Explorador de mercado:** navega por dominios, categorias, proveedores y productos con busqueda y filtros.
- **Fichas navegables:** paginas de detalle para cada dominio, categoria, proveedor y producto con datos cruzados.
- **Comparador interactivo:** selecciona hasta 4 productos y comparalos lado a lado (general, capacidades, cobertura).
- **Ranking contextual:** filtros eliminatorios (despliegue, dominio, categoria) + 6 pesos ajustables con score 0-100.
- **Capacidades evaluadas:** 80 productos con 20 dimensiones de evaluacion (arquitectura, integracion, seguridad, cumplimiento, comercial).
- **Datos abiertos:** todo disponible en JSON y CSV para reutilizacion.

## Quickstart

```bash
# Clonar
git clone https://github.com/pedri77/cybersecurity-master-matrix.git
cd cybersecurity-master-matrix

# Servir localmente (no requiere build)
python3 -m http.server 8765
# Abrir http://localhost:8765
```

No requiere Node.js, Jekyll ni compilacion. Static HTML + JS + CSS.

## Estructura

```
cybersecurity-master-matrix/
├── index.html              # Hub principal con stats y entry cards
├── domains.html            # Listado de 20 dominios
├── categories.html         # Listado de 122 categorias con filtros
├── providers.html          # Listado de 343 proveedores
├── products.html           # Listado de 486 productos
├── compare.html            # Comparador interactivo (hasta 4)
├── ranking.html            # Ranking contextual con pesos
├── domain.html             # Ficha dominio (hash routing: #D01)
├── category.html           # Ficha categoria (#C001)
├── provider.html           # Ficha proveedor (#slug)
├── product.html            # Ficha producto (#slug)
├── 404.html                # Error page
├── favicon.svg             # Icono SVG
├── sitemap.xml             # Sitemap para SEO
├── .nojekyll               # Bypass Jekyll en GitHub Pages
├── assets/
│   ├── data.js             # Modulo compartido: loader, nav, helpers
│   ├── app.js              # JS homepage
│   └── styles.css          # CSS con custom properties, responsive
├── data/
│   ├── matrix.json         # Todos los datos (fuente principal)
│   ├── domains.csv         # 20 dominios
│   ├── categories.csv      # 122 categorias
│   ├── providers.csv       # 343 proveedores
│   ├── products.csv        # 550 filas de producto
│   ├── product-capabilities.csv  # 80 productos evaluados
│   ├── category-provider-map.csv # 668 relaciones
│   ├── capabilities.csv    # 20 capacidades de evaluacion
│   └── sources.csv         # 15 fuentes de referencia
├── docs/
│   └── catalogo.md         # Catalogo en Markdown
└── .github/
    └── workflows/
        └── pages.yml       # Deploy automatico a GitHub Pages
```

## Modelo de datos

```
Dominio (D01-D20)
  └── Categoria (C001-C122)
        ├── Proveedor (343)
        │     └── Producto (486 unicos)
        │           └── Capacidades (20 dimensiones)
        └── Tipo de analisis + Prioridad
```

### Capacidades de evaluacion (20)

| Dimension | Capacidades |
|-----------|-------------|
| Producto y arquitectura | Despliegue, multi-tenancy, HA, escalabilidad |
| Integracion | API, integraciones nativas, formatos/estandares |
| Seguridad | Cifrado, identidad/acceso, auditoria |
| Operacion | Automatizacion, analitica/IA, observabilidad |
| Cumplimiento | Certificaciones, residencia de datos |
| Comercial | Licenciamiento, transparencia precios, servicios profesionales |
| Riesgo de proveedor | Viabilidad, dependencia/lock-in |

## Contribuir

Las modificaciones deben realizarse sobre los CSV o `data/matrix.json`, manteniendo IDs estables:

- Dominios: `D01`, `D02`, ...
- Categorias: `C001`, `C002`, ...
- Capacidades: `CAP001`, `CAP002`, ...
- Productos: `P001`, `P002`, ...

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para detalles.

## Fuentes de referencia

Gartner (Magic Quadrants, Market Guides), Forrester (Waves), IDC (MarketScapes), NIST (CSF, SP 800), ENISA, MITRE (ATT&CK, D3FEND), CIS, CISA, FIRST EPSS, NVD, documentacion oficial de fabricantes.

## Licencia

Contenido bajo [CC BY 4.0](LICENSE). Codigo de la interfaz reutilizable bajo MIT.

---

Creado por [pedri77](https://github.com/pedri77).
