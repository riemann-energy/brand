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

## Reglas duras

- **`dist/` es salida generada.** Si te encontrás editando un `.css` ahí, estás en el archivo
  equivocado. Se commitea porque jsDelivr sirve archivos del repo, pero se genera con `npm run build`.
- **Los primitivos no se usan directo.** `{color.celadon.3}` se referencia desde un semántico;
  nadie escribe `var(--color-celadon-3)` porque los primitivos ni siquiera salen al CSS.
- **Un token nuevo necesita su `$description`**, en español. Los comentarios del sistema explican
  decisiones de diseño que no se pueden perder — por qué el ámbar se corrió 24° para dejarle
  sitio al gas LP, por qué en tema claro el CTA se invierte.
- **Transforms explícitos, nunca `transformGroup: 'css'`.** El grupo trae `size/rem` y
  `time/seconds`, que convertirían `16px→1rem` y `420ms→0.42s`. Los valores están congelados y
  salen tal como se auditaron.

## Idioma

Nombres de token en **inglés**; `$description` y comentarios en **español**. Es
[ADR-0006](https://github.com/riemann-energy/meta/blob/main/why/0006-idioma.md).

## Este repo muestra el presente, no la historia

Acá no hay mapas de migración ni nombres deprecados: lo que está es lo vigente. Si te topás con
un artefacto viejo que usa nombres en español —una maqueta del taller—, la traducción está en el
[anexo del ADR-0006](https://github.com/riemann-energy/meta/blob/main/why/0006-anexo-mapa-de-nombres.json),
que es donde vive lo histórico.
