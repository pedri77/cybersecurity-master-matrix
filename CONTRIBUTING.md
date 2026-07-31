# Contribuir a CyberMatrix

## Tipos de contribucion

| Tipo | Archivos afectados | Complejidad |
|------|-------------------|-------------|
| Anadir proveedor | `providers.csv`, `category-provider-map.csv`, `matrix.json` | Baja |
| Anadir producto | `products.csv`, `matrix.json` | Baja |
| Evaluar capacidades | `product-capabilities.csv`, `matrix.json` | Media |
| Anadir categoria | `categories.csv`, `category-provider-map.csv`, `matrix.json` | Media |
| Anadir dominio | `domains.csv`, `categories.csv`, `matrix.json` | Alta |

## Workflow

1. Fork del repositorio.
2. Edita los CSV correspondientes.
3. Regenera `matrix.json` (script pendiente, por ahora edicion manual).
4. Verifica localmente con `python3 -m http.server 8765`.
5. Abre un pull request describiendo el cambio y la fuente.

## IDs estables

- Dominios: `D01`, `D02`, ... (consecutivos, nunca reutilizar)
- Categorias: `C001`, `C002`, ... (consecutivos)
- Capacidades: `CAP001`-`CAP020` (fijos, no anadir sin consenso)
- Productos: `P001`, `P002`, ... (consecutivos)

## Alta de proveedor

1. Verifica que no exista en `providers.csv`.
2. Anade fila con: nombre comercial, numero de dominios, numero de categorias, IDs de dominio, IDs de categoria, estado "Pendiente".
3. Anade las relaciones en `category-provider-map.csv`.

## Alta de producto

1. Verifica que el proveedor existe en `providers.csv`.
2. Anade fila(s) en `products.csv`: una fila por cada categoria que cubre el producto.
3. Usa nombres de producto oficiales, no comerciales.

## Evaluar capacidades

1. Edita `product-capabilities.csv`.
2. Usa SOLO valores del listado en `capabilities.csv` (separados por `;`).
3. Deja vacio si la capacidad no aplica o no hay informacion verificable.
4. Cita la fuente (documentacion oficial, no material promocional).

## Criterios de calidad

- Evidencia verificable (URL de documentacion oficial).
- Neutralidad tecnologica (sin lenguaje comercial).
- Nombres y taxonomia consistentes con el formato existente.
- Sin duplicados.
- Fecha de revision en el PR para informacion volatil.

## No se acepta

- Clasificaciones basadas solo en material promocional.
- Productos sin proveedor verificable.
- Categorias que solapen con existentes sin justificacion.
- Datos inventados o sin fuente.
