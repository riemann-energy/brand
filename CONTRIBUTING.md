# Cómo contribuir

El flujo de trabajo —rama, chequeos, PR, revisión— es el mismo en todos los repos y está en
[`meta/how-to/trabajar-en-un-repo.md`](https://github.com/riemann-energy/meta/blob/main/how-to/trabajar-en-un-repo.md).

Si es tu primera vez: [`meta/start/primer-dia.md`](https://github.com/riemann-energy/meta/blob/main/start/primer-dia.md).

## Lo específico de este repo

⚠️ **Es público.** Cualquier cosa que entre queda visible, y en el historial de git para siempre.

- **Nunca edites `dist/`.** Es salida generada: `npm run build`. Se commitea porque jsDelivr
  sirve archivos del repo.
- **El sistema está congelado.** Cambiar un valor necesita decisión registrada — no porque sea
  sagrado, sino porque obliga a reauditar contraste y a regenerar todo lo que lo consume.
- **Si tu cambio toca la marca, las tipografías o el `og:image`**, corré también
  `npm run check:visual`. Necesita Playwright, que no es dependencia del repo:
  `npm i -D playwright && npx playwright install chromium`.
- **Al publicar una versión**: actualizá `CHANGELOG.md` y **taggeá**. Sin tag, jsDelivr sigue
  sirviendo la versión vieja y el cambio no le llega a nadie — falla silenciosa.
