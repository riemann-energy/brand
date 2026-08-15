# brand/ADR-0010 · El acento pasa de celadón a menta

**Fecha:** 2026-08-15 · **Estado:** Aceptada · **Decide:** Marco

> **Firmado el 2026-08-15.** Marco y Andrés acordaron adoptarlo sabiendo que supersede D24 y
> D25, y **aceptando la colisión de 9.1° de matiz con `status.success`** en vez de dejarla
> abierta. Las tres quedan registradas como `D43`, `D44` y `D45` en
> `content/method/decisiones.md`.

---

## Contexto

El acento de marca era el celadón `#BADDCE`, elegido entre 14 candidatos y congelado el 2026-08-07.
En una sesión de diseño sobre el sitio se probó un menta saturado, `#3DF29A`, mediante un override
local en `site/src/styles/preview-acento-menta.css` — un archivo sin commitear cuyo único trabajo era
poder **ver** el color en pantalla antes de decidirlo. Se decidió adoptarlo.

Este ADR es el que convierte esa preferencia en sistema. Y tiene que empezar por lo incómodo.

## Lo que esta decisión supersede

**Dos decisiones registradas, las dos de Marco.** No es un ajuste dentro de lo acordado: lo
contradice.

| | Qué decía | Qué pasa ahora |
|---|---|---|
| **D24** (08-07) | El acento vive en la **zona pálida**: luminancia L .85–.93 y **croma bajo, C .04–.13**. Marco **descartó todos los saturados** — lima ácido, lima clásico, ámbar, magenta | El menta tiene **C .189**, 1.45× el techo de esa banda. Su luminosidad sí cae dentro: L .852 |
| **D25** (08-07) | El acento es **celadón `#BADDCE`**, elegido entre 14 candidatos | Deja de serlo |

La luminosidad no se movió, y eso importa: la mitad de D24 —la zona pálida— se respeta. Lo que se
rompe es la otra mitad, la reserva de croma.

⚠️ **Esto se escribió mientras el ADR estaba en `Propuesta`.** La paleta la decide Marco
(`meta/reference/quien-decide.md`), y la implementación se adelantó a la firma: el menta llegó a
`main`, a un tag y al sitio antes de que la decisión existiera. Salió bien porque la firma llegó,
pero el orden fue el equivocado y conviene no repetirlo.

## Decisión

**El acento de marca es el menta `#3DF29A`.** La rampa `celadon` se reemplaza por una rampa `mint`
de nueve pasos, y los dos temas repuntan a ella.

Además se agrega **un token semántico nuevo, `color.accent.atmosphere`**, que hasta ahora no existía
en el sistema: lo consumían cuatro componentes de `site` leyendo una variable CSS que **ningún
archivo de `brand` definía**, con respaldo silencioso a `accent-default`.

### Cómo se derivó la rampa

Cuatro pasos venían del preview, elegidos a ojo sobre pantalla: `3` (el acento), `1` (hover), `4`
(borde) y `7` (superficie teñida). Los otros cuatro —`0`, `2`, `5`, `6`, que solo usa el tema
claro— **no se eligieron a ojo**: se derivaron de su par celadón conservando la **luminosidad
OKLCH** y subiendo el croma, para que las relaciones de contraste que D26 auditó se mantuvieran por
construcción y no por suerte.

⚠️ **Los pasos `5` y `6` llevan un factor de croma menor que `0` y `2`** (×1.5 en vez de ×2.0). No
es un gusto: a esa luminosidad el matiz menta **no cabe en sRGB** con más croma. Con ×2.0 los dos
valores salían con el canal rojo en 0 —recortados contra la pared del gamut—, que es un color que
el espacio impone, no uno que alguien haya elegido.

El paso `8` es el ambiente, y es el único que no tiene par celadón: es el menta al 50% hacia el
celadón viejo. Existe porque el campo de partículas del hero **compone en modo aditivo**: los
brillos se suman en vez de taparse, y ahí el croma se amplifica. El celadón tenía 35 puntos entre su
canal máximo y el mínimo; el menta tiene 181. Con el croma del paso `3` el campo satura el verde a
tope, se queda plano y aplasta los cinco colores de recurso. Con el paso `8` los núcleos calientes
vuelven a resolver en blanco.

## Lo que se midió

**Contraste — el cambio es neutro.** Los dos pares obligatorios del acento, en tema oscuro:

```
                                   celadón   menta   umbral
texto del botón sobre el acento      13.36   13.40    4.5
acento como elemento sobre el fondo  13.36   13.40    3.0
```

`npm run check` da **32/32 pares en ambos temas**. El acento nunca fue el par ajustado del sistema
y sigue sin serlo.

**Separación de matiz — acá sí hay un costo, y ningún chequeo lo mira.**

`check-contrast.mjs` lo dice en su encabezado: *no* cubre la separación entre colores funcionales,
porque eso necesita distancia en OKLCH y no contraste WCAG. Medido a mano:

```
ΔH contra status.success (#42AC57)
   celadón   20.2°
   menta      9.1°
```

**El acento de marca y el verde de «éxito» quedan a 9° de matiz.** En un producto cuya salida son
semáforos por ubicación, que el color institucional y el de «todo bien» se lean como el mismo verde
es un problema funcional, no estético. D26 congeló la paleta declarando 9/9 pares de separación; ese
número **no se volvió a auditar** con el menta adentro.

## Consecuencias

**A favor**

- El acento gana presencia. Era la razón del cambio y se cumple.
- El sistema se queda con **un solo acento**: se movieron los dos temas, no solo el oscuro, así que
  las slides y la impresión no quedan en otro color que el sitio.
- **`accent-atmosphere` deja de ser un fantasma.** Cuatro componentes de `site` leían una variable
  que nadie definía; funcionaba por el respaldo `|| accent-default`, o sea que el ambiente llevaba
  meses cayendo a un color que no era el suyo sin que nada avisara.

**En contra**

- **Es MAJOR.** ADR-0008 es explícito: un cambio de valor que altere el contraste se trata como
  MAJOR aunque el nombre no cambie, porque quien actualiza no espera reauditar accesibilidad. Va a
  `2.0.0`.
- **Los assets de marca se movieron con él.** `check:tokens` rechaza cualquier color de un asset que
  no esté en el sistema, así que el celadón dentro de `riemann-marca.svg`, `favicon.svg` y
  `og-template.svg` no era opcional: o se movía todo o no compilaba. El `og.png` se re-renderizó y
  su centinela de inputs quedó al día.
- **En `site` hay que regenerar los ~218 baselines visuales.** Cambia el color en cada captura.

**Riesgo conocido**

- **La colisión con `status.success` se aceptó por escrito** (`D44`, 2026-08-15). Era una de las
  tres salidas —correr el verde de éxito en matiz, bajarle croma al menta, o asumirla— y es la que
  se eligió: se conoce, se midió y se asume.

  Lo que **sigue sin existir es la herramienta**: ningún chequeo del repo mide separación de matiz,
  así que si mañana alguien acerca un color funcional al acento, nada lo va a decir. Si el semáforo
  del producto llega a confundirse con la marca, esto es lo primero que hay que revisar.
- La rampa `celadon` se eliminó en vez de dejarse muerta, siguiendo la regla del repo de mostrar el
  presente y no la historia. El valor vive en el git y en D25.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Dejar el celadón** | Es lo que el cambio viene a revertir. Se registra igual porque es la opción que respeta D24 y D25 sin costo |
| **Usar `#7CE8B4` como acento** (el menta al 50% hacia el celadón) | Es la opción más interesante que se descartó: **cae dentro de D24** —L .852, C .125, contra un techo de .13— y sube ΔH contra `success` de 9.1° a ~16°. Se descartó porque no es el color que se eligió mirando la pantalla, no porque falle una medida |
| **Meter el menta solo como `accent-atmosphere`** y dejar el acento en celadón | No toca D24 ni D25 y sería MINOR en vez de MAJOR. Pero deja el sitio en celadón, que es exactamente lo contrario de lo pedido |
| **Cambiar el valor de `celadon.3` en vez de crear una rampa** | El nombre del primitivo mentiría sobre su color. ADR-0004 ya fijó que los índices son ordinales; el *nombre* de la rampa sigue siendo semántico |

## Relacionadas

- [ADR-0001 · Los primitivos no salen al CSS](0001-primitivos-no-salen-al-css.md) — por qué la
  rampa `mint` es interna y nadie escribe `var(--color-mint-3)`
- [ADR-0004 · Índices ordinales](0004-rampa-con-indices-ordinales.md) — por qué `mint.8` puede ser
  el ambiente sin romper el orden
- [ADR-0008 · Versionado](0008-versionado.md) — de dónde sale que esto es MAJOR
- [ADR-0009 · Estrategia de chequeos](0009-estrategia-de-chequeos.md) — por qué la separación de
  matiz no la cubre `check:contrast`
- `content/method/decisiones.md` · **D24, D25, D26** — lo que esta decisión contradice

---

> **Un ADR no se edita ni se borra.** Si la decisión se revierte, se escribe uno nuevo que la
> supersede y se marca esta como `Superseded por ADR-XXXX`.
