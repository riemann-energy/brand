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

Ninguno era sobre optimización. Los tres están resueltos.

| | Qué apareció | Cómo se resolvió |
|---|---|---|
| 🔴 | **`og.svg` tenía copy incrustado** — «Entre 6 y 15% de tu factura». Contenido dentro de `brand`, contra el flujo direccional. Y una afirmación con cifra sin fila en la matriz de prueba | ✅ [ADR-0007 cross-repo](https://github.com/riemann-energy/meta/blob/main/why/0007-og-image.md): el og queda sin copy. El og por página se genera en `web` desde `content` |
| 🔴 | **`og.svg` era SVG con `<text>`** — las plataformas que renderizan `og:image` mayormente no soportan SVG, y ninguna tiene Funnel Display | ✅ Ahora es `og.png` 1200×630, rasterizado con las fuentes incrustadas |
| 🟠 | **Dos colores fuera del sistema** — `#131614` y `#9BA5A0` | ✅ `#131614` → `graphite.14`; el `#9BA5A0` desapareció al rehacer el og |
