# brand/ADR-0002 · Transforms explícitos, no `transformGroup: 'css'`

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Style Dictionary trae grupos de transforms predefinidos. Lo idiomático para una salida CSS es
declarar `transformGroup: 'css'` y dejar que la herramienta haga el resto: es una línea contra
varias, y es lo que muestra toda la documentación.

Ese grupo incluye, entre otros, `size/rem` y `time/seconds`.

## Decisión

**Se declaran los transforms uno por uno:** `attribute/cti`, `name/kebab`, `color/css`. Nada más.

## Por qué

**Porque el grupo `css` habría alterado valores congelados.** `size/rem` convierte `16px` a
`1rem` y `time/seconds` convierte `420ms` a `0.42s`.

Ninguna de las dos conversiones es incorrecta en abstracto. Pero el sistema **está congelado**:
sus valores se auditaron tal como están, y la migración a DTCG tenía que ser un renombrado, no un
recálculo. Un `1rem` depende del tamaño de fuente raíz del documento; un `16px` no. Cambiar la
unidad cambia el comportamiento en cualquier página que toque el `font-size` del `html`.

**Y porque el fallo habría sido silencioso.** No hay error, no hay warning: el build pasa y el
CSS sale con otros valores. Solo se detectó porque la migración se verificó comparando valor por
valor contra el `tokens.css` original — 80 de 80.

## Consecuencias

**A favor**
- Los valores salen exactamente como se auditaron.
- La lista de transforms es legible: se ve qué le pasa a un token, sin abrir la documentación.

**En contra**
- **Hay que mantenerla.** Si mañana se agrega un tipo de token que necesita transform propio
  —sombras, bordes compuestos, tipografía como shorthand— no va a funcionar solo: hay que
  agregar el transform a mano. Un grupo lo habría cubierto.

**Riesgo conocido**
- Alguien que conozca Style Dictionary va a leer esto como un error y "arreglarlo" poniendo el
  grupo. Por eso está el comentario en `scripts/build.mjs`, la nota en el `CLAUDE.md` y este ADR.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **`transformGroup: 'css'`** | Convierte `16px→1rem` y `420ms→0.42s`; altera valores congelados |
| **Grupo `css` menos los dos transforms** | Style Dictionary no permite restar de un grupo: hay que enumerar igual |
| **Grupo `css` y aceptar rem** | Habría que reauditar el sistema con la unidad nueva. El renombrado no debe arrastrar un cambio de comportamiento |

## Relacionadas

- [ADR-0004 · Tokens en formato DTCG](https://github.com/riemann-energy/meta/blob/main/why/0004-tokens-dtcg.md)
