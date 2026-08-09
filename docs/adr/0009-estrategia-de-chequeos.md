# brand/ADR-0009 · Qué se chequea, y por qué el navegador va aparte

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Un repo de tokens no tiene lógica que testear: no hay funciones, no hay estados, no hay casos
borde. La tentación es no poner nada, o poner un framework de tests que después no tiene qué
probar.

Pero sí hay errores posibles, y **tres se cometieron mientras se construía este repo**:

1. Se usó `transformGroup: 'css'` en el primer intento, que habría convertido `16px→1rem` y
   `420ms→0.42s` sin un solo warning.
2. El `favicon.svg` traía `#131614` y el `og.svg` un `#9BA5A0`: dos grises elegidos a ojo que no
   existían en ningún token.
3. El primer render del `og.png` salió con la tipografía del sistema porque
   `document.fonts.ready` no espera a una fuente declarada pero todavía no usada.

## Decisión

**Se chequea lo que ya falló, no lo que podría fallar en teoría.** Dos niveles:

### Nivel 1 · Sin navegador, corre en cada push

| Chequeo | Atrapa |
|---|---|
| `dist/` coincide con el build | Que alguien edite la salida a mano o se olvide de rebuildear |
| Ningún hex escrito a mano en `tokens/semantic/` | Que se saltee la capa de primitivos |
| Toda referencia resuelve a un primitivo existente | Referencias rotas |
| Todo archivo semántico tiene `$description` | Tokens sin explicar |
| **Los colores de los SVG existen en la paleta** | El error 2 de arriba |
| Cada tipografía tiene su `OFL.txt` al lado | Incumplir la licencia en un repo público |
| Contraste WCAG en los dos temas | Que un cambio de valor rompa accesibilidad |

### Nivel 2 · Con navegador, job de CI aparte

| Chequeo | Atrapa |
|---|---|
| **`og.png` coincide con `og-template.svg`** | Editar la plantilla y no regenerar el PNG |
| **Las tipografías cubren el repertorio del español** | Un subsetting mal hecho |

## Por qué

**Por qué no hay framework de tests.** No hay unidades que testear. Un `vitest` acá sería
andamiaje alrededor de cinco `if`. Los chequeos son scripts que salen con código 1: eso es todo
lo que un CI necesita.

**Por qué el navegador va en un job aparte.** Instalar Chromium son ~130 MB y decenas de segundos
en cada push. Los chequeos que lo necesitan cubren dos archivos que cambian cuando cambia la
marca, o sea casi nunca. Meterlo en el job principal encarece todos los push para cubrir el 2% de
los cambios.

**Por qué el chequeo de tipografías compara anchos y no lee la fuente.** Leer la tabla `cmap` de
un WOFF2 exige descomprimir Brotli y deshacer las transformaciones del formato. Comparar el ancho
de cada carácter contra el del fallback es indirecto —dos fuentes podrían coincidir por
casualidad— pero atrapa el caso real, que no es un glifo suelto sino un subconjunto al que le
falta medio alfabeto.

**Cada chequeo se verificó rompiéndolo a propósito.** Un chequeo que nunca falla no prueba nada:
se metió un hex a mano, un color fuera de paleta y una plantilla desincronizada, y los tres
saltaron. Después se restauró.

## Consecuencias

**A favor**
- Los tres errores reales de esta sesión ahora rompen el build en vez de llegar a producción.
- El job principal sigue durando segundos.

**En contra**
- **Playwright no es dependencia del repo**, así que correr `check:visual` en local requiere
  instalarlo a mano. Es fricción deliberada.
- El job visual **no corre en todos los PR** —solo en push a `main` o con la etiqueta `visual`—
  así que una desincronización del `og.png` puede pasar la revisión y saltar recién al mergear.

**Riesgo conocido**
- El hash del PNG depende de la versión de Chromium. Un runner con otra versión podría producir
  un byte distinto y marcar un falso positivo. Si pasa, la salida sirve igual: dice qué correr
  para regenerarlo.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Sin chequeos** | Los tres errores de esta sesión habrían llegado a los consumidores |
| **Vitest o Jest** | Andamiaje sin unidades que probar |
| **Playwright en el job principal** | ~130 MB en cada push para cubrir dos archivos que casi nunca cambian |
| **Comparación de imagen píxel a píxel con umbral** | Más dependencias para un archivo que o está regenerado o no lo está |
