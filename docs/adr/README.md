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
| [0006](0006-fuentes-self-hosted.md) | Las tipografías van self-hosted | ✅ Decidida · ⬜ sin ejecutar |

## Sin decidir todavía

No tienen ADR porque no hay decisión: están acá para que se vea el hueco en vez de que alguien
asuma que se pensó.

| | Qué falta decidir | Por qué importa |
|---|---|---|
| **Versionado** | Cómo se versiona y se genera el CHANGELOG. Se mencionó Changesets, **no está instalado ni evaluado** | Los consumidores apuntan a un tag: sin changelog no saben si subir de versión les rompe el contraste |
| **Optimización de SVG** | Si los assets de marca pasan por SVGO y con qué configuración. **No está instalado** | El repo es público: los SVG se copian tal como están |
| **Publicación en npm** | Diferida a propósito, con disparador definido. No es un hueco: [ver ARCHITECTURE](https://github.com/riemann-energy/meta/blob/main/ARCHITECTURE.md) | |

---

Plantilla: [`meta/why/PLANTILLA.md`](https://github.com/riemann-energy/meta/blob/main/why/PLANTILLA.md).
La regla de cuándo un ADR es local y cuándo cruza repos está en
[`meta/reference/convenciones.md`](https://github.com/riemann-energy/meta/blob/main/reference/convenciones.md).
