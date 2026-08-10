# ADR-0004 · El `og.png` se verifica por sus inputs, no re-renderizando

**Fecha:** 2026-08-10 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

El chequeo `check:visual` verificaba que `og.png` estuviera al día así: **volvía a
renderizar la plantilla y comparaba el hash del PNG resultante** contra el commiteado.

No podía pasar en CI. El hash de un PNG depende del Chromium que lo produce, y el
workflow lo instalaba con `npm i -D playwright` **sin pinear la versión**: cualquier
actualización del navegador cambiaba los bytes sin que nada real hubiera cambiado.

Se verificó que no era un asset viejo: `og-template.svg` y `og.png` entraron en el
**mismo commit** (`0adcaff`), así que la plantilla no cambió después del render.
**Regenerar el PNG no arreglaba nada** — habría vuelto a fallar con el próximo Chromium.

Es el mismo problema que `site` tuvo con sus 226 baselines visuales
(`site`/ADR-0006): una comparación byte a byte de un render, contra un render de otra
máquina.

## Decisión

**El chequeo compara el hash de los INPUTS, no del render.**

`render-og.mjs` escribe dos archivos en el mismo paso: `brand-assets/og.png` y
`brand-assets/og.inputs.sha256`, el hash de los tres archivos de los que sale el PNG:

```
brand-assets/og-template.svg
fonts/funnel-display-latin.woff2
fonts/hanken-grotesk-latin.woff2
```

`check:visual` recalcula ese hash y lo compara con el centinela. **No abre el navegador
para esto.**

Y dos cosas más, para que el resto del chequeo sea reproducible:

- **`playwright` pasa a ser una devDependency pineada** (`1.62.1`), no un
  `npm i -D playwright` sin versión en el workflow.
- **El job visual del CI corre en `mcr.microsoft.com/playwright:v1.62.1-noble`**, la
  misma imagen que `site` (`site`/ADR-0006), y la misma que se usa en local. El chequeo
  de tipografías sí necesita navegador: mide el ancho de cada glifo.

## Por qué

### Por qué el centinela y no pinear el render

Pinear la imagen —lo que hicimos en `site`— haría reproducible la comparación de bytes.
Pero seguiría siendo **la pregunta equivocada**: subir Playwright invalidaría el PNG
commiteado y obligaría a regenerarlo sin que nada visual haya cambiado. El baseline
quedaría atado a la versión del navegador, no al diseño.

Lo que el chequeo quiere saber es: *«¿este PNG salió de los inputs que hay hoy en el
repo?»*. Eso es exactamente lo que el centinela contesta, y no depende de ningún
renderizador.

### Por qué el centinela es confiable

Porque **lo escribe el mismo paso que produce el PNG**. No se puede actualizar sin
renderizar: si alguien edita la plantilla y corre solo el chequeo, falla; y para que
deje de fallar tiene que correr `render-og.mjs`, que regenera el PNG **y** el centinela
juntos.

### Por qué los tres archivos y no solo la plantilla

Porque las tipografías están **incrustadas en el render** como data: URI. Si se cambia
un WOFF2 —un subsetting nuevo, otra versión— el PNG publicado queda viejo aunque la
plantilla no se haya tocado. Hashear solo la plantilla dejaría ese caso afuera.

## Consecuencias

**A favor**
- El chequeo pasa en CI, y falla solo cuando hay algo real que arreglar.
- Es más rápido: no abre el navegador para esto.
- Cubre las tipografías, que la versión anterior no distinguía.
- Verificado en las dos direcciones: se le cambió la plantilla a mano y **lo detectó**;
  se restauró y volvió a pasar.

**En contra — el peaje que se acepta**
- **No verifica que el PNG se vea bien**, solo que corresponda a sus inputs. Un render
  roto que salga de los inputs correctos pasa el chequeo. Contra eso está la
  verificación dura que ya tiene `render-og.mjs`: si la tipografía no cargó, tira error
  en vez de guardar el PNG.
- **Un archivo generado más que commitear** (`og.inputs.sha256`). Es de una línea.
- **Si alguien regenera el centinela a mano**, el chequeo queda ciego. Es un archivo
  generado: no se edita, se produce.

**Riesgo conocido**
- **Agregar un input al render y olvidarse de sumarlo a `INPUTS`** deja ese input sin
  vigilar, en silencio. La lista está declarada en los dos scripts y tiene que moverse
  junta.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Re-renderizar y comparar bytes** (lo anterior) | El hash depende del Chromium. Con la versión sin pinear falla en cada actualización; incluso pineada, subir Playwright invalidaría el PNG sin motivo visual |
| **Hashear solo `og-template.svg`** | Deja las tipografías sin vigilar, y están incrustadas en el render |
| **Sacar el chequeo** | Es la única cosa que impide que el `og:image` publicado quede mintiendo |
| **Comparar con un umbral de píxeles** (como los baselines de `site`) | Traería toda la maquinaria de baselines visuales para un solo PNG generado |

## Relacionadas

- [`site`/ADR-0006](https://github.com/riemann-energy/site/blob/main/docs/adr/0006-los-tests-visuales-corren-en-linux-siempre.md)
  — el mismo problema con otra salida: allá se pinea el entorno porque lo que se compara
  **es** el render; acá se cambia la pregunta
- [`meta`/ADR-0007](https://github.com/riemann-energy/meta/blob/main/why/0007-og-image.md)
  — por qué el `og:image` es un PNG sin copy generado desde `brand`

---

> **Un ADR no se edita ni se borra.** Si la decisión se revierte, se escribe uno nuevo que la
> supersede y se marca esta como `Superseded por ADR-XXXX`.
