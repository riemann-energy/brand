# fonts

Las tres familias del sistema, **self-hosted**. Congeladas el 2026-08-07 (D28).

| Familia | Rol | Licencia |
|---|---|---|
| Funnel Display | Títulos | SIL Open Font License |
| Hanken Grotesk | Cuerpo | SIL Open Font License |
| Geist Mono | Dato | SIL Open Font License |

Las tres son OFL: cero licencias, cero costo, incrustables en PDF.

## Los archivos

| Archivo | | |
|---|---|---|
| `funnel-display-latin.woff2` · `-latin-ext` | 17.3 + 9.3 kb | variable, 300–800 |
| `hanken-grotesk-latin.woff2` · `-latin-ext` | 33.9 + 19.1 kb | variable, 300–800 |
| `geist-mono-latin.woff2` · `-latin-ext` | 22.6 + 14.4 kb | variable, 400–600 |
| `*-OFL.txt` | | la licencia de cada familia |

**116.5 kb en total.** Se traen con `node scripts/fetch-fonts.mjs`, que está en el repo para que
el origen de cada archivo quede documentado y actualizar no sea adivinar.

Las `@font-face` salen a **`dist/fonts.css`**, aparte de `tokens.css`, para que quien solo quiera
los tokens no se lleve 116 kb de fuentes.

## Por qué self-hosted y no el CDN de Google

En orden de peso: **privacidad** (la IP del visitante viaja a Google, y el sitio ya tiene
exposición LFPDPPP pendiente), **versión fija** (Google actualiza sus fuentes sin aviso) y
**velocidad** (un DNS y un handshake menos). El detalle completo, con las alternativas
descartadas, está en [`docs/adr/0006`](../docs/adr/0006-fuentes-self-hosted.md).

## Dos cosas que suelen malentenderse

**El español entero cabe en `latin`.** La ñ es U+00F1, los acentos van de U+00E1 a U+00FA, y
comillas y guiones caen en U+2000-206F. `latin-ext` es para checo, polaco y turco — se trae
porque su costo en runtime es **cero** (con `unicode-range` el navegador solo lo baja si la
página usa un carácter de ese rango) y cubre nombres propios extranjeros.

**Variable, no estáticas.** Medido: 116.5 kb contra 285.9 kb, 6 archivos contra 14.
