# Changelog

Qué cambió en cada versión, para decidir si te conviene actualizar. Sigue
[SemVer](https://semver.org/lang/es/), con el criterio para tokens definido en
[ADR-0008](docs/adr/0008-versionado.md):

- **MAJOR** — se renombra o se elimina un token, o un cambio de valor altera el contraste
- **MINOR** — se agrega un token o un formato de salida
- **PATCH** — cambia un valor sin tocar nombres ni contraste

---

## [1.1.0] — sin publicar

**MINOR: se agregan ocho tokens, no cambia ninguno.** Los pidió la implementación de las diez
páginas restantes del sitio: seis agentes distintos reportaron los mismos huecos sin haberse
coordinado, que es la mejor señal de que el hueco es real y no un gusto.

### Agregado

- **`font.leading.snug` (1.4) y `font.leading.relaxed` (1.5)** — la escala tenía tres valores y las
  maquetas usan cinco. Sin estos dos, los bloques nuevos caían al interlineado de cuerpo (1.62) y
  **sus páginas salían visiblemente más aireadas que el Home**. Es la clase de deriva que no rompe
  nada y hace que el sitio se sienta de dos manos distintas.
- **`font.tracking.label` (0.19em), `.pill` (0.16em) y `.micro` (0.1em)** — estaban literales en
  `etiqueta.module.css` y `pastilla.module.css`. `site`/ADR-0003 los dejó como deuda con una regla
  explícita: *«al tercer uso se vuelve token»*. Ya pasaron de tres.
- **`motion.lift` (-3px)** — cuánto sube un elemento al pasar el cursor. Estaba a mano en el nav, en
  `H-03` y en tres bloques nuevos. **No es `motion.distance`**, que es la distancia de *entrada* del
  revelado: son dos gestos distintos, y usar uno por el otro daba un salto de 18px.
- **`motion.duration.medium` (600ms)** — entre `default` (420) y `slow` (900). Los resplandores de
  tarjeta con 420ms se sienten abruptos.
- **`shadow.glow`** — el sistema no tenía ninguna escala de sombra y dos bloques la escribieron
  idéntica a mano. Es solo la **geometría**: el color lo pone quien la usa, porque cambia con el tema.

**Verificado:** 89 variables, 32/32 pares de contraste pasan en ambos temas. Ningún token existente
cambió de nombre ni de valor, así que nada de lo que ya consume `brand` se mueve.

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
