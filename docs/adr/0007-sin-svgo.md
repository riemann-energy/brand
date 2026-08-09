# brand/ADR-0007 · Los SVG no pasan por SVGO

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

La práctica estándar es pasar todo SVG por un optimizador —SVGO— antes de publicarlo. Existe
porque los editores de diseño exportan SVG con basura: metadata de la aplicación, capas vacías,
`id` generados, transformaciones redundantes, decimales de quince dígitos.

Este repo es público, así que sus SVG se van a copiar tal como están.

## Decisión

**No se usa SVGO.** Los cuatro assets se mantienen a mano.

## Por qué

**Porque no fueron exportados de un editor: están escritos a mano.** Los cuatro pesan entre 298
bytes y 993 bytes, con paths de dos comandos y sin una sola etiqueta de más. No hay nada que
optimizar: SVGO ahorraría decenas de bytes.

**Y porque lo único que sí borraría es lo que hay que conservar.** Cada archivo tiene un
comentario que dice qué es y de qué versión de la marca sale — `I8-C-chaflan-corto-mono`, la
razón por la que el favicon lleva fondo propio. SVGO elimina comentarios por defecto. En un repo
público, donde alguien va a abrir el archivo para entender qué está copiando, ese comentario vale
más que los bytes.

**El disparador para reconsiderar:** que un asset entre exportado desde un editor. Ahí SVGO deja
de ser innecesario y pasa a ser obligatorio, y este ADR se supersede.

## Consecuencias

**A favor**
- Una dependencia menos y un paso menos en el build.
- Los archivos siguen siendo legibles y editables a mano, que es como se hicieron.

**En contra**
- **No hay red de seguridad.** Si alguien pega un SVG exportado sin limpiar, nada lo detecta.
- Los assets quedan bajo disciplina, no bajo herramienta — y la disciplina falla.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **SVGO con `removeComments: false`** | Configuración a mantener para ahorrar decenas de bytes en cuatro archivos escritos a mano |
| **SVGO en pre-commit** | Mismo costo, más fricción, y reescribe archivos que se editan a mano |

---

## Anexo · Lo que sí apareció al revisarlos

Ninguno es sobre optimización. Están acá porque se encontraron en esta revisión y no tenían
dónde vivir.

| | Qué | Estado |
|---|---|---|
| 🔴 | **`og.svg` tiene copy incrustado** — «Entre 6 y 15% de tu factura. Medido, no prometido.» Eso es contenido, y `brand` no debe contener contenido ([ADR-0003 cross-repo](https://github.com/riemann-energy/meta/blob/main/why/0003-flujo-direccional.md)). Además es una afirmación con cifra, que necesita su fila en la matriz de prueba | ⬜ sin resolver |
| 🔴 | **`og.svg` es SVG y usa `<text>`** — las plataformas que renderizan `og:image` (WhatsApp, LinkedIn, Slack) mayormente **no soportan SVG**, y ninguna tiene Funnel Display instalada. Tal como está, no funciona como og:image | ⬜ sin resolver |
| 🟠 | **Dos colores fuera del sistema** — `#131614` en `favicon.svg` y `#9BA5A0` en `og.svg` no existen en los primitivos. Se eligieron a ojo | ⬜ sin resolver |

Los tres tocan a `brand` **y** a `content`, así que la decisión de qué hacer con `og.svg` es
cross-repo y va a `meta/why/` cuando se tome.
