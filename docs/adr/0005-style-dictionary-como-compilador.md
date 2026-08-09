# brand/ADR-0005 · Style Dictionary como compilador

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Los tokens se escriben en DTCG ([ADR-0004](https://github.com/riemann-energy/meta/blob/main/why/0004-tokens-dtcg.md)),
pero el formato es solo la fuente: hace falta algo que lo convierta en CSS, en JS y —cuando la
plataforma exista— en lo que esa plataforma consuma.

El campo se movió bastante desde que el estándar se estabilizó en octubre de 2025.

## Decisión

**Style Dictionary v5**, en su modo API desde `scripts/build.mjs`.

## Por qué

- **Es lo que usan los sistemas que tomamos de referencia.** `primer/primitives` y Adobe Spectrum
  compilan con él. Cuando algo se rompa, el problema ya lo tuvo alguien.
- **Tiene soporte de primera clase para DTCG desde v4**, y v5 alcanzó compatibilidad completa con
  la versión 2025.10 del estándar. No hay capa de traducción entre lo que escribimos y lo que el
  compilador entiende.
- **Exporta a todas las plataformas que podríamos necesitar** —CSS, SCSS, JS, iOS, Swift,
  Android, Compose, Flutter— sin cambiar de herramienta. Importa por la plataforma, que hoy no
  existe y podría no ser web.
- **Lo mantiene Tokens Studio**, que es también el plugin estándar de tokens en Figma. Si algún
  día el diseño se mueve a Figma, la cadena ya está integrada.

**Se usa la API de Node y no un `config.json`** porque el sistema necesita tres pasadas —una por
el `:root` invariante y una por cada tema— concatenadas en un solo archivo. El config declarativo
no expresa eso sin duplicar la definición de tokens.

## Consecuencias

**A favor**
- Ecosistema grande: transforms, formats y ejemplos para casi todo.
- La ruta a otras plataformas ya está resuelta.

**En contra**
- **Arrastra Node 22 como piso**, porque v5 usa `Set.prototype.union` para resolver referencias.
  No es negociable y hay que declararlo en el CI y en `engines`.
- **Su API por defecto altera valores** (`size/rem`, `time/seconds`), lo que obligó a declarar los
  transforms uno por uno — ver [ADR-0002](0002-transforms-explicitos.md). Una herramienta
  DTCG-first probablemente no habría tenido esa trampa.

**Riesgo conocido**
- v5 trajo cambios que rompen: las referencias a nodos que no son tokens dejaron de permitirse. Un
  salto de versión mayor puede volver a pedir migración. El chequeo de paridad contra los valores
  esperados es la red que atrapa eso.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Terrazzo** (ex Cobalt) | Es la alternativa seria y es **DTCG-first por diseño**, lo que evita la trampa de los transforms. Se descartó por ecosistema: menos ejemplos, menos adopción entre los sistemas de referencia, y ninguna ventaja que compense para un sistema congelado de ~80 tokens. **Es el reemplazo natural si Style Dictionary estorba** |
| **Theo** (Salesforce) | Deprecado |
| **Script propio** | Son ~80 tokens: escribir el compilador es tentador y barato hoy. Se descartó porque el costo no está en generar CSS sino en las plataformas siguientes —Swift, Compose, Figma— y ahí un script propio es todo trabajo nuevo |
| **Exportar directo desde Figma** | No hay archivo de Figma: la identidad se construyó en código. La cadena iría al revés |

## Relacionadas

- [ADR-0002 · Transforms explícitos](0002-transforms-explicitos.md) — la consecuencia directa de esta elección
