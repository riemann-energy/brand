# Decisiones de `brand`

Las que **tocan solo este repo**. Las que cruzan repos viven en
[`meta/why/`](https://github.com/riemann-energy/meta/tree/main/why).

**Append-only.** Un ADR no se edita ni se borra: si una decisión se revierte, se escribe una
nueva que la supersede.

| | Decisión | Estado |
|---|---|---|
| [0001](0001-primitivos-no-salen-al-css.md) | Los primitivos no salen al CSS | ✅ Aceptada |
| [0002](0002-transforms-explicitos.md) | Transforms explícitos, no `transformGroup: 'css'` | ✅ Aceptada |
| [0003](0003-dist-commiteado.md) | `dist/` se commitea al repo | ✅ Aceptada |
| [0004](0004-rampa-con-indices-ordinales.md) | La rampa de grafito usa índices ordinales | ✅ Aceptada |
| [0005](0005-style-dictionary-como-compilador.md) | Style Dictionary como compilador | ✅ Aceptada |
| [0006](0006-fuentes-self-hosted.md) | Las tipografías van self-hosted | ✅ Aceptada |
| [0007](0007-sin-svgo.md) | Los SVG no pasan por SVGO | ✅ Aceptada |
| [0008](0008-versionado.md) | SemVer con CHANGELOG a mano, sin Changesets | ✅ Aceptada |
| [0009](0009-estrategia-de-chequeos.md) | Qué se chequea, y por qué el navegador va aparte | ✅ Aceptada |
| [0010](0010-el-acento-pasa-de-celadon-a-menta.md) | El acento pasa de celadón a menta | ✅ Aceptada — supersede D24 y D25 |

## Sin decidir todavía

**Ninguna.** El acento menta se firmó el 2026-08-15 (`D43`), y con él se aceptó por escrito que
quede a **9.1° de matiz** de `status.success` (`D44`).

⚠️ Que la colisión esté aceptada no la vuelve invisible: **ningún chequeo del repo mide separación
de matiz**. `check:contrast` cubre contraste WCAG, que es otra cosa. Si mañana alguien acerca un
color funcional al acento, nada lo va a decir.

Las tres cosas que estaban abiertas antes sí se resolvieron: el `og:image` en
[ADR-0007 cross-repo](https://github.com/riemann-energy/meta/blob/main/why/0007-og-image.md), y
los dos colores fuera del sistema al rehacerlo.

**Publicación en npm** tampoco es un hueco: está diferida a propósito y con disparador definido,
en [ARCHITECTURE de `meta`](https://github.com/riemann-energy/meta/blob/main/ARCHITECTURE.md).

---

Plantilla: [`meta/why/PLANTILLA.md`](https://github.com/riemann-energy/meta/blob/main/why/PLANTILLA.md).
La regla de cuándo un ADR es local y cuándo cruza repos está en
[`meta/reference/convenciones.md`](https://github.com/riemann-energy/meta/blob/main/reference/convenciones.md).
