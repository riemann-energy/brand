# brand/ADR-0006 · Las tipografías van self-hosted, no por CDN de terceros

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

Las tres familias del sistema —Funnel Display, Hanken Grotesk y Geist Mono— son SIL Open Font
License, así que se pueden hospedar sin licencia ni costo.

Hoy las maquetas del taller las cargan desde el CDN de Google Fonts, que es lo más rápido de
montar y no requiere ningún archivo en el repo.

## Decisión

**Los archivos viven en este repo**, en `fonts/`, y el sitio los sirve desde su propio dominio.

- Formato **WOFF2** únicamente.
- Subconjunto **`latin` + `latin-ext`**.
- El archivo de licencia OFL de cada familia acompaña a los `.woff2`.
- Las `@font-face` salen a un `dist/fonts.css` aparte, para que quien solo quiera tokens no se
  lleve las fuentes.

## Por qué

**1 · Privacidad, y es el argumento que decide.** Con el CDN de Google, el navegador tiene que
abrir una conexión a Google para bajar el archivo, y esa conexión lleva la IP del visitante. El
sitio ya tiene una exposición legal pendiente —el formulario pide recibos de CFE, o sea datos
personales y patrimoniales bajo LFPDPPP— y no conviene sumarle una transferencia a un tercero que
no controlamos y que habría que declarar.

**2 · La tipografía no cambia sola.** Google actualiza sus fuentes sin aviso. Con los archivos en
el repo, lo que se auditó es lo que se sirve, y un cambio pasa por un commit.

**3 · Velocidad.** Elimina la resolución de DNS y el handshake TCP hacia otro host, que en sitios
simples es una parte medible del tiempo de carga.

**Por qué `latin-ext` no es opcional:** es el subconjunto que trae los acentos y la ñ. Sin él, el
sitio se ve bien en inglés y roto en español — que es el idioma del contenido.

## Consecuencias

**A favor**
- Cero terceros en la ruta de renderizado del texto.
- La licencia OFL se cumple visiblemente: el repo es público y los archivos de licencia están.

**En contra**
- **Los archivos de fuente entran al repo.** Son binarios y pesan; el repo deja de ser solo texto.
- Hay que **rehacer el subsetting** si algún día el contenido necesita caracteres fuera de
  `latin-ext`.
- Actualizar una fuente pasa a ser trabajo manual: bajar, subsetear, commitear, taggear.

**Riesgo conocido**
- Un subsetting mal hecho rompe caracteres de forma silenciosa: se ve bien en la revisión y falla
  en una palabra con `ü` o con comillas tipográficas. Conviene una página de prueba con el
  repertorio completo antes de dar por buena una fuente.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **CDN de Google Fonts** | La IP del visitante viaja a Google. Con LFPDPPP pendiente, es sumar exposición evitable |
| **Bunny Fonts** | Espeja la API de Google respetando privacidad y es un cambio de un solo host — pero sigue siendo un tercero en la ruta de renderizado, y no resuelve el problema de la versión que cambia sola |
| **Fontsource** (npm) | Buena opción y self-hosted de verdad. Se descartó porque ata las fuentes a un build de Node: quien consuma el sistema por CDN se queda sin ellas |

## Estado

⬜ **Decidido, no ejecutado.** Los archivos todavía no están en `fonts/`; las maquetas siguen
cargando de Google Fonts. Ver [`fonts/README.md`](../../fonts/README.md).
