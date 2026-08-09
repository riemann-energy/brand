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

## Sin decidir todavía

| | Qué falta | Dónde |
|---|---|---|
| **Qué hacer con `og.svg`** | Tiene copy incrustado y es SVG con `<text>`: no funciona como og:image y contiene contenido, que no debe vivir en `brand`. Toca también a `content` → la decisión es cross-repo | [anexo del ADR-0007](0007-sin-svgo.md#anexo--lo-que-sí-apareció-al-revisarlos) |
| **Dos colores fuera del sistema** | `#131614` y `#9BA5A0` no existen en los primitivos | idem |

**Publicación en npm** no es un hueco: está diferida a propósito y con disparador definido, en
[ARCHITECTURE de `meta`](https://github.com/riemann-energy/meta/blob/main/ARCHITECTURE.md).

---

Plantilla: [`meta/why/PLANTILLA.md`](https://github.com/riemann-energy/meta/blob/main/why/PLANTILLA.md).
La regla de cuándo un ADR es local y cuándo cruza repos está en
[`meta/reference/convenciones.md`](https://github.com/riemann-energy/meta/blob/main/reference/convenciones.md).
