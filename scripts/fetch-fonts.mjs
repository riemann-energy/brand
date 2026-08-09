/**
 * Trae las tipografías del sistema desde Google Fonts y las deja self-hosted.
 *
 * Está en el repo y no se hizo a mano a propósito: documenta de dónde salió cada
 * archivo, permite actualizar sin adivinar, y deja constancia de qué subconjuntos
 * y qué pesos se pidieron. Ver docs/adr/0006-fuentes-self-hosted.md.
 *
 *   node scripts/fetch-fonts.mjs
 *
 * Se corre a mano, no en cada build: las fuentes cambian una vez por año, si acaso.
 */
import { writeFile, mkdir } from 'node:fs/promises';

// Un User-Agent moderno es lo que hace que Google devuelva woff2 en vez de formatos viejos.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/**
 * Solo latin y latin-ext.
 *
 * Ojo con una creencia común: el español entero cabe en `latin`. La ñ es U+00F1, los
 * acentos van de U+00E1 a U+00FA, y comillas y guiones caen en U+2000-206F — todos
 * dentro del rango de `latin`. `latin-ext` es para checo, polaco, turco.
 *
 * Se trae igual porque su costo en runtime es CERO: con `unicode-range`, el navegador
 * solo descarga ese archivo si la página usa un carácter de ese rango. Cubre nombres
 * propios extranjeros —un cliente «Müller», una marca «Škoda»— sin pagar nada por
 * anticipado. Lo único que paga es el repo: 42.8 de los 116.5 kb.
 */
const SUBCONJUNTOS = ['latin', 'latin-ext'];

/**
 * Se piden las variables (un archivo con todo el rango de peso) y no los estáticos.
 * Medido: 116kb contra 286kb, y 6 archivos contra 14.
 */
const FAMILIAS = [
  { nombre: 'Funnel Display', slug: 'funnel-display', rango: 'wght@300..800', ofl: 'funneldisplay' },
  { nombre: 'Hanken Grotesk', slug: 'hanken-grotesk', rango: 'wght@300..800', ofl: 'hankengrotesk' },
  { nombre: 'Geist Mono',     slug: 'geist-mono',     rango: 'wght@400..600', ofl: 'geistmono' },
];

const traer = async (url) => {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} al traer ${url}`);
  return r;
};

await mkdir('fonts', { recursive: true });
await mkdir('dist', { recursive: true });

const caras = [];

for (const familia of FAMILIAS) {
  const url = `https://fonts.googleapis.com/css2?family=${familia.nombre.replace(/ /g, '+')}:${familia.rango}&display=swap`;
  const css = await (await traer(url)).text();

  for (const [, subconjunto, cuerpo] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)) {
    if (!SUBCONJUNTOS.includes(subconjunto)) continue;

    const origen = cuerpo.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    const rangoUnicode = cuerpo.match(/unicode-range:\s*([^;]+);/)?.[1].trim();
    const pesos = cuerpo.match(/font-weight:\s*([^;]+);/)?.[1].trim();
    if (!origen) continue;

    const archivo = `${familia.slug}-${subconjunto}.woff2`;
    const bytes = Buffer.from(await (await traer(origen)).arrayBuffer());
    await writeFile(`fonts/${archivo}`, bytes);

    caras.push({ familia: familia.nombre, archivo, pesos, rangoUnicode, kb: bytes.length / 1024 });
    console.log(`  ${archivo.padEnd(30)} ${(bytes.length / 1024).toFixed(1).padStart(6)} kb`);
  }

  // La licencia acompaña a los archivos: es requisito de la OFL y este repo es público.
  const ofl = await traer(`https://raw.githubusercontent.com/google/fonts/main/ofl/${familia.ofl}/OFL.txt`);
  await writeFile(`fonts/${familia.slug}-OFL.txt`, await ofl.text());
}

const fontFace = caras
  .map(
    (c) => `@font-face {
  font-family: "${c.familia}";
  font-style: normal;
  font-weight: ${c.pesos};
  font-display: swap;
  src: url("../fonts/${c.archivo}") format("woff2");
  unicode-range: ${c.rangoUnicode};
}`,
  )
  .join('\n\n');

await writeFile(
  'dist/fonts.css',
  `/* ═══════════════════════════════════════════════════════════════════
   TIPOGRAFÍAS RIEMANN ENERGY · generado por scripts/fetch-fonts.mjs
   ───────────────────────────────────────────────────────────────────
   Self-hosted, no desde el CDN de Google: ver docs/adr/0006.
   Las tres son SIL Open Font License; la licencia de cada una está
   junto a su archivo en fonts/.

   Va aparte de tokens.css para que quien solo quiera los tokens no se
   lleve ${caras.reduce((s, c) => s + c.kb, 0).toFixed(0)} kb de fuentes.
   ═══════════════════════════════════════════════════════════════════ */

${fontFace}
`,
  'utf8',
);

console.log(
  `\n✓ ${caras.length} archivos · ${caras.reduce((s, c) => s + c.kb, 0).toFixed(1)} kb en total → dist/fonts.css`,
);
