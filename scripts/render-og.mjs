/**
 * Rasteriza brand-assets/og-template.svg a og.png, 1200×630.
 *
 * Por qué hace falta rasterizar: las plataformas que renderizan og:image —WhatsApp,
 * LinkedIn, Slack, X— mayormente NO soportan SVG, y ninguna tiene Funnel Display
 * instalada. Un SVG con <text> se ve con la fuente equivocada o no se ve. Ver
 * meta/why/0007-og-image.md.
 *
 *   node scripts/render-og.mjs
 *
 * Requiere Playwright, que NO es dependencia de este repo: se corre a mano cuando
 * cambia la marca, o sea casi nunca, y agregar ~300 MB de navegadores al CI de un
 * repo público por un PNG no se justifica.
 *
 *   npm i -D playwright && npx playwright install chromium
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error(
    'Falta Playwright. Es a propósito — este script se corre a mano:\n' +
      '  npm i -D playwright && npx playwright install chromium',
  );
  process.exit(1);
}

// Los tres archivos de los que sale el PNG. Si cambia cualquiera y nadie
// re-renderiza, el og publicado queda mintiendo — es lo que el centinela detecta.
const INPUTS = [
  'brand-assets/og-template.svg',
  'fonts/funnel-display-latin.woff2',
  'fonts/hanken-grotesk-latin.woff2',
];

const svg = await readFile('brand-assets/og-template.svg', 'utf8');

// Las fuentes se incrustan como data: URI para que el render no dependa de que
// estén instaladas en el sistema ni de una conexión a la red.
const incrustar = async (archivo) =>
  `data:font/woff2;base64,${(await readFile(`fonts/${archivo}`)).toString('base64')}`;

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: "Funnel Display";
    src: url("${await incrustar('funnel-display-latin.woff2')}") format("woff2");
    font-weight: 300 800;
  }
  @font-face {
    font-family: "Hanken Grotesk";
    src: url("${await incrustar('hanken-grotesk-latin.woff2')}") format("woff2");
    font-weight: 300 800;
  }
  html, body { margin: 0; padding: 0; }
  svg { display: block; }
</style>
${svg}`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html);

// `document.fonts.ready` no alcanza: una fuente declarada pero todavía no usada en
// layout no se considera pendiente, y el screenshot sale con la sans de sistema.
// Hay que pedirla explícitamente y recién ahí esperar.
await pagina.evaluate(async () => {
  await Promise.all([
    document.fonts.load('600 76px "Funnel Display"'),
    document.fonts.load('400 76px "Funnel Display"'),
  ]);
  await document.fonts.ready;
});

// Verificación dura: si la fuente no quedó cargada, el PNG saldría con la tipografía
// equivocada y nadie se enteraría hasta verlo compartido en WhatsApp.
const cargada = await pagina.evaluate(() => document.fonts.check('600 76px "Funnel Display"'));
if (!cargada) throw new Error('Funnel Display no cargó: el render saldría con la fuente equivocada');

await pagina.screenshot({ path: 'brand-assets/og.png' });
await navegador.close();

// ── El centinela de inputs ────────────────────────────────────────────────────
//
// Se escribe ACÁ, en el mismo paso que produce el PNG, y no en otro lado: eso es lo
// que lo hace confiable. El centinela dice «este og.png salió de estos tres
// archivos», y solo se actualiza cuando el render efectivamente corre.
//
// El chequeo (check-visual.mjs) recalcula el hash de los inputs y lo compara. NO
// re-renderiza: comparar bytes de un render contra otro Chromium hace que el chequeo
// falle cada vez que el navegador se actualiza, sin que nada real haya cambiado.
// Ver docs/adr/0004.
const huella = createHash('sha256');
for (const archivo of INPUTS) huella.update(await readFile(archivo));
await writeFile('brand-assets/og.inputs.sha256', `${huella.digest('hex')}  ${INPUTS.join(' ')}\n`);

const { size } = await import('node:fs').then((fs) => fs.promises.stat('brand-assets/og.png'));
console.log(`✓ brand-assets/og.png — 1200×630, ${(size / 1024).toFixed(1)} kb`);
console.log('✓ brand-assets/og.inputs.sha256 — el centinela de sus inputs');
