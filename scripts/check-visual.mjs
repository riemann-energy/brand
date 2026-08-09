/**
 * Chequeos que necesitan un navegador. Sale con código 1 si algo no cuadra.
 *
 *   node scripts/check-visual.mjs
 *
 * Requiere Playwright:  npm i -D playwright && npx playwright install chromium
 * Corre en un job de CI aparte, no en el principal: instalar un navegador para
 * cada push a un repo de tokens es caro y casi siempre innecesario.
 *
 * Verifica dos cosas que ningún chequeo estático puede ver:
 *
 *   1. og.png sigue coincidiendo con og-template.svg. Sin esto, alguien edita la
 *      plantilla, se olvida de regenerar, y el PNG publicado queda mintiendo.
 *
 *   2. Las tipografías cubren el repertorio del español. Un subsetting mal hecho
 *      falla de forma silenciosa: se ve bien en la revisión y rompe en la palabra
 *      con «ü» o con comillas tipográficas.
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Falta Playwright:\n  npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const fallos = [];
const navegador = await chromium.launch();

const incrustar = async (archivo) =>
  `data:font/woff2;base64,${(await readFile(`fonts/${archivo}`)).toString('base64')}`;

// ── 1 · El og.png commiteado coincide con su plantilla ───────────────────────
{
  const svg = await readFile('brand-assets/og-template.svg', 'utf8');
  const html = `<!doctype html><meta charset="utf-8"><style>
    @font-face { font-family:"Funnel Display"; src:url("${await incrustar('funnel-display-latin.woff2')}") format("woff2"); font-weight:300 800; }
    @font-face { font-family:"Hanken Grotesk"; src:url("${await incrustar('hanken-grotesk-latin.woff2')}") format("woff2"); font-weight:300 800; }
    html,body{margin:0;padding:0} svg{display:block}
  </style>${svg}`;

  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  await pagina.setContent(html);
  await pagina.evaluate(async () => {
    await Promise.all([
      document.fonts.load('600 76px "Funnel Display"'),
      document.fonts.load('400 76px "Funnel Display"'),
    ]);
    await document.fonts.ready;
  });
  const recien = await pagina.screenshot();
  await pagina.close();

  const hash = (b) => createHash('sha256').update(b).digest('hex').slice(0, 12);
  const commiteado = await readFile('brand-assets/og.png');
  if (hash(recien) !== hash(commiteado)) {
    fallos.push(
      'og.png no coincide con og-template.svg\n' +
        `     commiteado ${hash(commiteado)} · regenerado ${hash(recien)}\n` +
        '     corré: node scripts/render-og.mjs',
    );
  }
}

// ── 2 · Las tipografías cubren el repertorio del español ─────────────────────
// Método: se mide cada carácter con la fuente del sistema y con la nuestra. Si el
// glifo falta, el navegador cae al fallback y los dos anchos coinciden exactamente.
// No es infalible —dos fuentes pueden coincidir por casualidad— pero atrapa el caso
// real, que es un subconjunto al que le falta medio alfabeto.
{
  const REPERTORIO = 'áéíóúüñÁÉÍÓÚÜÑ¿¡«»–—' + String.fromCodePoint(0x2018, 0x2019, 0x201c, 0x201d);
  const FAMILIAS = [
    ['Funnel Display', 'funnel-display'],
    ['Hanken Grotesk', 'hanken-grotesk'],
    ['Geist Mono', 'geist-mono'],
  ];

  for (const [familia, slug] of FAMILIAS) {
    const html = `<!doctype html><meta charset="utf-8"><style>
      @font-face { font-family:"${familia}"; src:url("${await incrustar(`${slug}-latin.woff2`)}") format("woff2"); font-weight:300 800; }
      @font-face { font-family:"${familia}"; src:url("${await incrustar(`${slug}-latin-ext.woff2`)}") format("woff2"); font-weight:300 800;
                   unicode-range:U+0100-02BA,U+1E00-1E9F,U+2C60-2C7F,U+A720-A7FF; }
    </style><body></body>`;

    const pagina = await navegador.newPage();
    await pagina.setContent(html);
    const faltantes = await pagina.evaluate(
      async ([familia, repertorio]) => {
        await document.fonts.load(`400 64px "${familia}"`);
        await document.fonts.ready;
        const lienzo = document.createElement('canvas').getContext('2d');
        const fuera = [];
        for (const caracter of repertorio) {
          lienzo.font = `64px "${familia}", monospace`;
          const conFuente = lienzo.measureText(caracter).width;
          lienzo.font = '64px monospace';
          const soloFallback = lienzo.measureText(caracter).width;
          if (conFuente === soloFallback) fuera.push(caracter);
        }
        return fuera;
      },
      [familia, REPERTORIO],
    );
    await pagina.close();

    if (faltantes.length) {
      fallos.push(`${familia} no cubre: ${faltantes.join(' ')}`);
    } else {
      console.log(`  ✓ ${familia.padEnd(16)} cubre los ${[...REPERTORIO].length} caracteres del español`);
    }
  }
}

await navegador.close();

if (fallos.length) {
  console.error(`\n❌ ${fallos.length} problema(s):\n\n   ${fallos.join('\n\n   ')}\n`);
  process.exit(1);
}
console.log('\n✅ visual: og.png al día y tipografías completas\n');
