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

## Poner este repo a andar

```bash
git clone git@github.com:riemann-energy/brand.git
git config core.hooksPath .githooks     # la compuerta local, una vez por clon
npm ci
npm run check                            # build · privacidad · sistema · contraste 32/32
```

## Este repo SÍ exige PR

Es el único público, así que es el único donde los rulesets funcionan: **no se puede pushear a
`main`** y el chequeo `check` tiene que pasar. No hace falta que otra persona apruebe.

## Antes de proponer un color o una marca

Ya se evaluaron **8 direcciones de identidad, 14 acentos y 60 marcas**, con el veredicto de cada uno
y —lo que importa— **los criterios que los descartaron**:
[`docs/exploracion-de-identidad.md`](docs/exploracion-de-identidad.md).

## Un cambio de token no llega solo al sitio

Después de mergear hay que **etiquetar una versión** (`git tag v1.2.0 && git push origin v1.2.0`) y
**subirla en `site`**. Los consumidores apuntan a un tag, no a `main`.

La cadena completa, con el paso de los baselines visuales que traba a todo el mundo:
[meta/how-to/cambiar-un-token.md](https://github.com/riemann-energy/meta/blob/main/how-to/cambiar-un-token.md).

## Los dos generados que se commitean

- **`dist/`** — salida de Style Dictionary. Se commitea porque jsDelivr sirve archivos del repo, no
  artefactos de build. **Nunca se edita a mano.**
- **`brand-assets/og.png` y `og.inputs.sha256`** — los produce `node scripts/render-og.mjs`, los dos
  en la misma corrida. El chequeo compara el hash de los inputs, no el del PNG
  ([ADR-0004](docs/adr/0004-el-og-se-verifica-por-sus-inputs.md)). Si editás la plantilla o una
  tipografía, hay que volver a renderizar.

