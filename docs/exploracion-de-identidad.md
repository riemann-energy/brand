# Lo que se exploró y lo que se descartó

**Leé esto antes de proponer un color o una marca.** No es historia por gusto: son 8 direcciones,
14 acentos y 60 marcas que ya se evaluaron. Proponer algo que está en la columna «por qué no» es
gratis, pero no aporta.

**Fecha de la exploración:** agosto de 2026. **Decidió:** Marco.

---

## 1 · La base: 8 direcciones completas

Cada dirección era base + acento + tipografía, aplicada a una landing real —no a muestritas de
color— para poder juzgarla en contexto.

`Campo eléctrico` · `Bosque` · `Papel técnico` · `Corriente` · `Pistache` · **`Grafito`** ·
`Bosque nocturno` · `Piedra`

**Se eligió `Grafito`:** casi-negro neutro, **sin tinte verde en las superficies**, con el acento
usado con mucha reserva.

Eso ya descarta una familia entera de propuestas: cualquier cosa que tiña las superficies. El
sistema apuesta a que el color aparezca poco y por eso pegue.

## 2 · El acento: 14 candidatos sobre la base fija

| Acento | Hex | Familia | Veredicto |
|---|---|---|---|
| **Celadón** | `#BADDCE` | frío | ✅ **elegido.** Verde-agua pálido y frío — el único de los 14 que se va al lado azul del verde |
| Pistache | `#C6F293` | verde | Sobre grafito pierde fuerza: sin verde en las superficies, el acento queda solo y se lee tímido |
| Lima ácido | `#DBFF4F` | verde | El de mayor impacto, y el que más lee «tendencia de 2026». **Descartado por saturado** |
| Lima clásico | `#A3E635` | verde | El lima más usado de la industria: cero riesgo, cero distinción |
| Oliva luminoso | `#CBD68B` | verde | El más sobrio. Se queda corto: si el CTA no destaca, no cumple su trabajo |
| Ámbar filamento | `#FF9838` | cálido | **Descartado por saturado** |
| Magenta eléctrico | `#FF4D9D` | frío | **Descartado por saturado** |
| Arena cálida | `#E8D9AE` | cálido | Finalista junto con pistache |
| Lino | `#DEE5C4` | puente | — |
| Salvia | `#BED3AE` | verde | — |
| Pistache frío | `#B9F0AE` | verde | — |
| Marfil | `#F2E9D2` | cálido | — |
| Durazno pálido | `#F3D3B6` | cálido | — |
| Dúo · pistache + arena | — | sistema | Dos acentos en vez de uno |

### El criterio que descartó a cuatro

**Los saturados están fuera** —lima ácido, lima clásico, ámbar, magenta— y no por gusto: **el acento
tiene que tener reserva.** En un sistema donde el color aparece poco, un acento saturado grita.

Si vas a proponer un saturado, el ADR tiene que atacar ese criterio, no solo mostrar que se ve bien.

## 3 · La marca: 60 exploradas en 9 familias

Las nueve ideas que se exploraron:

> «La suma de Riemann» · «Sin apellido, desde el sistema» · «En el lenguaje de tus referencias» ·
> «Seis conceptos más, mismo idioma» · «Ocho maneras de partir el intervalo» · «Sin trazo, todo
> sólido» · «Diez maneras de espejar» · «Nueve maneras de hacer la ranura» · «Menos ajustar la caja,
> más romperla»

**Se eligió `I8-C`**, la variante de chaflán corto: dos macizos, una ranura, dos chaflanes opuestos,
sobre una retícula de 24. Las otras cuatro del mismo esqueleto —`I8-A` base, `I8-B` chaflán largo,
`I8-D` ranura ancha, `I8-E` cuatro cortes— están en `brand-assets/`, cada una con su versión
monocromática.

### Las cuatro condiciones que cumplieron esas 60

Una propuesta que se pueda evaluar en el mismo plano tiene que cumplirlas:

1. **SVG, no PNG.** Vectorial, sin trazo dependiente del tamaño.
2. **Funciona en monocromo.** Si necesita color para leerse, no sirve para un sello ni un favicon.
3. **Sobrevive al tamaño chico.** Si la ranura se cierra a 16 px, la marca no aguanta.
4. **Sale de una retícula, no del pulso.** Es lo que permite ajustarla después sin rehacerla.

---

## Dónde está el material visual, y por qué no está acá

Las maquetas de la exploración —los 14 acentos aplicados a una landing completa, las 60 marcas en
una parrilla, y las capturas de cada opción— **no están en este repo a propósito**: llevan el copy
del sitio embebido, y este repo es **público**. El copy vive en `content`, que es privado por
[ADR-0001](https://github.com/riemann-energy/meta/blob/main/why/0001-arquitectura-de-repos.md).

Están archivadas fuera de GitHub. **Pedíselas a Marco antes de proponer**: ver los 14 aplicados de
un tirón cambia la conversación, y es más rápido que discutir hexadecimales.

## Cómo se propone un cambio

La identidad está **congelada**: no es sagrada, es cara. Cambiar el acento reaudita 32 pares de
contraste y regenera 226 capturas del sitio.

El camino completo está en
[meta/how-to/cambiar-un-token.md](https://github.com/riemann-energy/meta/blob/main/how-to/cambiar-un-token.md)
— y el primer paso es un **ADR**, porque una decisión congelada se descongela por escrito.
