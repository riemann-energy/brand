# brand/ADR-0001 · Los primitivos no salen al CSS

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

El sistema tiene dos capas de tokens: primitivos (`color.celadon.3 = #BADDCE`) y semánticos
(`color.accent.default = {color.celadon.3}`). Al compilar hay que decidir cuáles se exponen como
variables CSS.

Style Dictionary emite por defecto todo lo que encuentra. Exponer las dos capas es gratis y da
más opciones a quien consume.

## Decisión

**Al CSS solo salen los semánticos.** Los primitivos existen únicamente dentro de los archivos
DTCG, como origen de las referencias.

Se implementa con un filtro por ruta: `token.filePath.includes('/semantic/')`.

## Por qué

**Porque exponerlos invita a saltarse la capa semántica.** Si `--color-celadon-3` existe, alguien
lo va a usar directo para un caso que "no encaja en ningún semántico" — y en ese momento el
sistema deja de poder cambiar. El valor de tener capas es que cambiar el celadón sea un solo
valor; un consumidor que apunta al primitivo rompe esa propiedad sin que nadie se entere.

**Y porque el tema deja de funcionar.** Los semánticos cambian entre claro y oscuro; los
primitivos no. Un componente que usa `--color-celadon-3` se ve igual en los dos temas, que es
justamente el bug que la capa semántica previene.

El `tokens.css` original tampoco los exponía: nació con nombres semánticos y sin capa de
primitivos. Esta decisión conserva ese contrato.

## Consecuencias

**A favor**
- El CSS público es más chico y no tiene nombres que no deban usarse.
- Un cambio de primitivo se propaga por las referencias, sin consumidores colgados de él.

**En contra**
- Si aparece un caso legítimo que necesita un color crudo, hay que **crear el semántico** en vez
  de usar el primitivo. Es más ceremonia, y es a propósito: obliga a nombrar para qué sirve.

**Riesgo conocido**
- El filtro es por ruta de archivo. Si alguien mete un token semántico dentro de
  `tokens/primitives/`, desaparece del CSS sin error. Se nota en el build (falta la variable),
  pero no hay un chequeo que lo grite.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Exponer las dos capas** | El consumidor termina usando el primitivo y rompe el tema |
| **Exponer primitivos con prefijo `_`** | Una convención que pide disciplina es una convención que se incumple |
