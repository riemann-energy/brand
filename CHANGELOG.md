# Changelog

Qué cambió en cada versión, para decidir si te conviene actualizar. Sigue
[SemVer](https://semver.org/lang/es/), con el criterio para tokens definido en
[ADR-0008](docs/adr/0008-versionado.md):

- **MAJOR** — se renombra o se elimina un token, o un cambio de valor altera el contraste
- **MINOR** — se agrega un token o un formato de salida
- **PATCH** — cambia un valor sin tocar nombres ni contraste

---

## [1.0.0] — sin publicar

Primera versión del sistema como repositorio. Migra el `tokens.css` escrito a mano del taller a
tokens DTCG compilados con Style Dictionary.

**Verificado:** los 80 valores son idénticos a los del sistema congelado. La migración cambió
nombres, no píxeles.

### Agregado
- 80 tokens en formato DTCG, en dos capas: primitivos y semánticos.
- `dist/tokens.css` — variables CSS, con `:root` y los dos temas.
- `dist/tokens.js` — los mismos tokens como objeto, para consumo desde código.
- `dist/fonts.css` y las tres tipografías self-hosted (116.5 kb, variable, `latin` + `latin-ext`).
- Chequeo de contraste WCAG en ambos temas: 32 pares, todos pasan.
- CI: build, contraste, y verificación de que `dist/` coincide con los tokens.

### Cambiado
- **Los tokens se renombraron de español a inglés** (`--fondo` → `--color-bg-default`). Ningún
  valor cambió. La traducción completa está en el
  [anexo del ADR-0006 de `meta`](https://github.com/riemann-energy/meta/blob/main/why/0006-anexo-mapa-de-nombres.json).
- El atributo de tema pasa de `data-tema="oscuro"|"claro"` a `data-theme="dark"|"light"`.

### Eliminado
- `--radio`, alias heredado de las maquetas que duplicaba `--r-caja` con el mismo valor. Su
  reemplazo es `--radius-box`.
