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

// ── 1 · El og.png salió de sus inputs actuales ────────────────────────────────
//
// NO se re-renderiza para comparar bytes. Ese era el diseño anterior y no podía
// pasar en CI: el hash de un PNG depende del Chromium que lo produce, y el workflow
// instala Playwright sin pinear. Fallaba cada vez que el navegador se actualizaba,
// sin que nada real hubiera cambiado. Ver docs/adr/0004.
//
// Lo que se verifica es lo que importa: que el PNG commiteado corresponda a los
// inputs commiteados. El centinela lo escribe `render-og.mjs` en el mismo paso que
// produce el PNG, así que no se puede actualizar sin renderizar.
{
  const INPUTS = [
    'brand-assets/og-template.svg',
    'fonts/funnel-display-latin.woff2',
    'fonts/hanken-grotesk-latin.woff2',
  ];

  const huella = createHash('sha256');
  for (const archivo of INPUTS) huella.update(await readFile(archivo));
  const actual = huella.digest('hex');

  let centinela;
  try {
    centinela = (await readFile('brand-assets/og.inputs.sha256', 'utf8')).trim().split(/\s+/)[0];
  } catch {
    fallos.push(
      'falta brand-assets/og.inputs.sha256\n' + '      corré: node scripts/render-og.mjs',
    );
  }

  if (centinela && centinela !== actual) {
    fallos.push(
      'og.png no salió de los inputs actuales\n' +
        `      centinela ${centinela.slice(0, 12)} · inputs ${actual.slice(0, 12)}\n` +
        '      cambió la plantilla o una tipografía y nadie regeneró el PNG\n' +
        '      corré: node scripts/render-og.mjs',
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
