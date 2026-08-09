# brand/ADR-0008 · SemVer con CHANGELOG a mano, sin Changesets

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Los consumidores apuntan a un tag: `brand@v1.0.0` en el URL de jsDelivr, o
`github:riemann-energy/brand#v1.0.0` en un `package.json`. Para decidir si subir de versión,
necesitan saber qué cambió y si les rompe algo.

Al describir el stack se mencionó **Changesets** —lo estándar en sistemas de diseño— pero nunca
se instaló ni se evaluó. Este ADR cierra ese hueco.

## Decisión

**SemVer, `CHANGELOG.md` escrito a mano, tag de git en cada release.** Sin Changesets ni
`semantic-release`.

Y —la parte que importa— **qué significa cada número para un sistema de tokens**:

| | Cuándo | Ejemplo |
|---|---|---|
| **MAJOR** | Se renombra o se elimina un token · cambia el atributo de tema · cambia el nombre de un archivo de `dist/` | `--color-accent-default` pasa a llamarse otra cosa |
| **MINOR** | Se agrega un token · se agrega un formato de salida · se agrega un peso de fuente | aparece `--color-status-neutral` |
| **PATCH** | Cambia el **valor** de un token sin tocar su nombre · corrección en un asset | el celadón se corrige medio tono |

**Un cambio de valor que altere el contraste se trata como MAJOR, no como PATCH**, aunque el
nombre no cambie. Un consumidor que actualiza un patch no espera tener que reauditar
accesibilidad.

## Por qué

**Por qué no Changesets.** Está diseñado para monorepos con muchos paquetes y muchos PRs
concurrentes: su valor es coordinar versiones entre paquetes que dependen entre sí. Acá hay **un
paquete, un sistema congelado y quizá dos o tres releases al año**. El costo —un archivo de
changeset por PR, más su configuración y su CI— no compra nada en ese escenario.

**Por qué tampoco `semantic-release`.** Derivar la versión de los mensajes de commit es elegante
y ya usamos Conventional Commits. Pero la regla de arriba —que un cambio de valor puede ser MAJOR
si toca el contraste— es un juicio, no algo que se pueda leer de un prefijo `fix:`. Automatizar
la versión acá automatiza el error.

**Por qué a mano no es deuda en este caso.** Con dos o tres releases al año, escribir el
changelog es media hora al año, y obliga a mirar qué cambió antes de publicarlo — que es
precisamente lo que un sistema congelado necesita.

## Consecuencias

**A favor**
- Cero dependencias y cero configuración de release.
- La decisión MAJOR/PATCH la toma una persona mirando el impacto real.

**En contra**
- **Depende de disciplina.** Nada obliga a actualizar el `CHANGELOG.md` antes de taggear.
- Es un juicio: dos personas podrían clasificar el mismo cambio distinto. La tabla de arriba
  existe para reducir eso, no lo elimina.

**Riesgo conocido**
- Olvidar el tag. Sin tag, jsDelivr sigue sirviendo la versión vieja y el cambio no le llega a
  nadie — falla silenciosa, no ruidosa.

**Disparador para reconsiderar:** que `brand` pase a tener más de un paquete publicable, o que los
releases pasen a ser mensuales. Ahí Changesets empieza a pagar.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **Changesets** | Resuelve coordinación entre paquetes de un monorepo; acá hay un solo paquete |
| **`semantic-release`** | Derivaría la versión del prefijo del commit, y la regla de contraste es un juicio que ningún prefijo captura |
| **Sin versionar, apuntar a `main`** | El sistema podría cambiar abajo de los pies de los consumidores sin aviso |
