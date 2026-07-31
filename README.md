# Matriz Maestra Global de Ciberseguridad

Repositorio de referencia para clasificar, comparar y evaluar mercados, categorías, productos y proveedores de ciberseguridad.

## Contenido

- **20 dominios** estratégicos.
- **122 categorías** tecnológicas.
- **343 proveedores** únicos.
- **668 relaciones** categoría–proveedor.
- Exportaciones en **JSON y CSV**.
- Interfaz web estática con búsqueda y filtros.

## Publicar con GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta a la rama `main`.
3. En **Settings → Pages**, selecciona **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda los cambios. GitHub publicará el sitio automáticamente.

No necesita Node.js, Jekyll ni proceso de compilación. El archivo `.nojekyll` fuerza la publicación directa de los archivos estáticos.

## Estructura

```text
.
├── index.html
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── .nojekyll
├── assets/
│   ├── app.js
│   └── styles.css
├── data/
│   ├── matrix.json
│   └── *.csv
└── docs/
    └── catalogo.md
```

## Modelo de contribución

Las modificaciones de categorías y proveedores deben realizarse sobre los CSV o sobre `data/matrix.json`, manteniendo identificadores estables:

- Dominios: `D01`, `D02`, ...
- Categorías: `C001`, `C002`, ...
- Capacidades: `CAP001`, `CAP002`, ...

## Licencia

Contenido publicado bajo licencia CC BY 4.0. El código de la interfaz puede reutilizarse bajo MIT.
