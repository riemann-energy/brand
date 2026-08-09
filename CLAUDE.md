# CLAUDE.md — brand

**Antes de decidir algo estructural, leé el repo [`meta`](https://github.com/riemann-energy/meta).**
Ahí están el mapa, las convenciones y las decisiones que cruzan repos.

## Lo primero: este repo es PÚBLICO

⚠️ **Nada que identifique a un cliente entra acá.** Ni nombres, ni RPUs, ni sucursales, ni
montos, ni capturas de producto. Es el repo con menos margen de error del sistema.

## El sistema está congelado

Paleta, marca, tipografía y medidas se congelaron el 2026-08-07 (D22–D29). Si te piden cambiar
un valor:

1. **Preguntá si hay decisión registrada.** Congelado significa que se cambia con decisión
   escrita, no que no se pueda.
2. Si la hay, editá **`tokens/**.json`** — nunca `dist/`.
3. Corré `npm run check`. Si el contraste falla, el cambio no entra: es accesibilidad, no
   preferencia.

## Reglas duras, con su justificación

Cada una tiene un ADR: si te parece que está mal, leelo antes de cambiarla. Varias parecen
errores y no lo son.

| Regla | Por qué |
|---|---|
| **`dist/` es salida generada** — si estás editando un `.css` ahí, estás en el archivo equivocado. Se commitea, pero se genera con `npm run build` | [ADR-0003](docs/adr/0003-dist-commiteado.md) |
| **Los primitivos no se usan directo.** `{color.celadon.3}` se referencia desde un semántico; nadie escribe `var(--color-celadon-3)` porque ni siquiera sale al CSS | [ADR-0001](docs/adr/0001-primitivos-no-salen-al-css.md) |
| **Transforms explícitos, nunca `transformGroup: 'css'`** — el grupo convertiría `16px→1rem` y `420ms→0.42s`, y el fallo sería silencioso | [ADR-0002](docs/adr/0002-transforms-explicitos.md) |
| **Los primitivos se numeran por posición, no por luminosidad.** `graphite.7` no dice qué tan claro es | [ADR-0004](docs/adr/0004-rampa-con-indices-ordinales.md) |

Y una que no necesita ADR: **un token nuevo necesita su `$description`**, en español. Los
comentarios del sistema explican decisiones de diseño que no se pueden perder — por qué el ámbar
se corrió 24° para dejarle sitio al gas LP, por qué en tema claro el CTA se invierte.

## Si tomás una decisión, escribila

Toda decisión no obvia se justifica en un ADR en `docs/adr/`. Un comentario en el código no
cuenta: explica qué hacer, no por qué. **El trabajo no está terminado hasta que la decisión esté
escrita.** Plantilla y regla completa en
[`meta`](https://github.com/riemann-energy/meta/blob/main/reference/convenciones.md).

## Idioma

Nombres de token en **inglés**; `$description` y comentarios en **español**. Es
[ADR-0006](https://github.com/riemann-energy/meta/blob/main/why/0006-idioma.md).

## Este repo muestra el presente, no la historia

Acá no hay mapas de migración ni nombres deprecados: lo que está es lo vigente. Si te topás con
un artefacto viejo que usa nombres en español —una maqueta del taller—, la traducción está en el
[anexo del ADR-0006](https://github.com/riemann-energy/meta/blob/main/why/0006-anexo-mapa-de-nombres.json),
que es donde vive lo histórico.
