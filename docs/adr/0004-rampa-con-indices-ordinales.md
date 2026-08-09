# brand/ADR-0004 · La rampa de grafito usa índices ordinales, no una escala numérica

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Los primitivos de color necesitan nombre. La convención más extendida es la escala numérica de
luminosidad —`gray.50`, `gray.100`, `gray.200`… `gray.950`— popularizada por Tailwind y usada por
buena parte de los sistemas de diseño.

Esa convención asume que la rampa es **regular**: que los saltos entre escalones son parejos y
que el número dice algo sobre la luminosidad.

La rampa de Riemann no es así. Sus 18 valores no se generaron con una fórmula: **cada uno se
eligió por su par de contraste** durante la auditoría. Los tres tonos de superficie del tema
oscuro (`#121414`, `#191C1C`, `#0F1111`) están a distancias distintas entre sí, y no hay ningún
valor en la mitad de la rampa porque el sistema no lo necesitaba.

## Decisión

**Los primitivos se numeran de forma ordinal: `color.graphite.0` … `color.graphite.17`**,
ordenados de más claro a más oscuro. El número indica **posición**, no luminosidad.

Lo mismo para `color.celadon.0` … `celadon.7`.

Los estados e insumos sí usan escala convencional (`red.400`, `red.700`) porque tienen exactamente
dos valores —uno por tema— y ahí el número sí comunica claro contra oscuro.

## Por qué

**Porque forzar una escala regular sobre valores irregulares inventa una estructura que no
existe.** Habría que asignar números como `graphite.870` y `graphite.930` para respetar las
distancias reales — números que aparentan precisión y no significan nada, o peor, que insinúan
que hay un `graphite.900` disponible entre ellos cuando no lo hay.

**Y porque nadie consume estos nombres.** Los primitivos no salen al CSS
([ADR-0001](0001-primitivos-no-salen-al-css.md)): su único lector es quien edita los archivos
DTCG. Para ese lector, "el cuarto tono más oscuro" es información más útil que un número que
finge ser una medida.

## Consecuencias

**A favor**
- La rampa es honesta sobre lo que es: una lista ordenada de valores auditados.
- Agregar un tono intermedio no obliga a renumerar: se puede insertar al final y reordenar la
  lectura por el `$description`.

**En contra**
- **Rompe la expectativa de quien viene de Tailwind o de Primer.** `graphite.7` no dice nada
  sobre qué tan claro es; hay que abrir el archivo para saberlo.
- No se puede razonar "necesito uno un poco más oscuro que el 500" sin mirar los valores.

**Riesgo conocido**
- Si la rampa crece mucho, los ordinales se vuelven difíciles de recordar. El disparador para
  reconsiderar es que haga falta interpolar valores nuevos de forma sistemática — ahí una escala
  generada sí ganaría, y este ADR se supersede.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Escala 50–950 al escalón más cercano** | Los valores no caen en escalones parejos; obliga a números como `870` que aparentan precisión |
| **Nombres descriptivos** (`graphite.surface`, `graphite.border`) | Eso es la capa semántica. Un primitivo con nombre de rol deja de ser primitivo |
| **Regenerar la rampa con una fórmula OKLCH** | Cambiaría los valores, y el sistema está congelado tras una auditoría de contraste |
