/**
 * Build del sistema — DTCG JSON → dist/
 *
 * Tres pasadas, porque los dos temas comparten nombres semánticos y solo cambian
 * los primitivos que referencian:
 *   1. invariantes  → :root                  tipografía, espaciado, radios, movimiento
 *   2. tema oscuro  → [data-theme="dark"]    color y efectos
 *   3. tema claro   → [data-theme="light"]   color y efectos
 *
 * Los primitivos NO salen al CSS. Son internos: existen para que un cambio de color
 * sea un valor y no una búsqueda de hex por todos lados. Quien consume el sistema
 * usa los semánticos.
 *
 * Transforms explícitos en vez de transformGroup 'css': el grupo trae `size/rem` y
 * `time/seconds`, que convertirían 16px→1rem y 420ms→0.42s. Los valores están
 * congelados y deben salir tal como se auditaron.
 */
import StyleDictionary from 'style-dictionary';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';

const TRANSFORMS = ['attribute/cti', 'name/kebab', 'color/css'];
const PRIMITIVES = 'tokens/primitives/*.json';

const ENCABEZADO = `/* ═══════════════════════════════════════════════════════════════════
   SISTEMA RIEMANN ENERGY · generado, NO editar a mano
   ───────────────────────────────────────────────────────────────────
   Fuente: tokens/**.json (formato DTCG)
   Build:  npm run build
   El origen único de color, tipografía y medidas. Ninguna maqueta ni
   componente escribe un valor a mano: todos importan este archivo.
   ═══════════════════════════════════════════════════════════════════ */

`;

/** Construye una pasada y devuelve el CSS, sin escribirlo a disco. */
async function pasada({ source, selector, filtro }) {
  const sd = new StyleDictionary({
    source,
    log: { verbosity: 'silent' },
    platforms: {
      css: {
        transforms: TRANSFORMS,
        buildPath: 'dist/.tmp/',
        files: [{
          destination: `${selector.replace(/[^a-z]/g, '') || 'root'}.css`,
          format: 'css/variables',
          filter: filtro,
          options: { selector, outputReferences: false, showFileHeader: false },
        }],
      },
    },
  });
  await sd.buildAllPlatforms();
  const archivo = `dist/.tmp/${selector.replace(/[^a-z]/g, '') || 'root'}.css`;
  return readFile(archivo, 'utf8');
}

/** Solo semánticos: los primitivos no se exponen. */
const esSemantico = (token) => token.filePath.includes('/semantic/');
/** Un tema aporta únicamente los tokens de su propio archivo. */
const deArchivo = (nombre) => (token) => token.filePath.endsWith(nombre);

const base = await pasada({
  source: [
    PRIMITIVES,
    'tokens/semantic/typography.json',
    'tokens/semantic/layout.json',
    'tokens/semantic/motion.json',
  ],
  selector: ':root',
  filtro: esSemantico,
});

const oscuro = await pasada({
  source: [PRIMITIVES, 'tokens/semantic/color-dark.json'],
  selector: '[data-theme="dark"]',
  filtro: deArchivo('color-dark.json'),
});

const claro = await pasada({
  source: [PRIMITIVES, 'tokens/semantic/color-light.json'],
  selector: '[data-theme="light"]',
  filtro: deArchivo('color-light.json'),
});

await mkdir('dist', { recursive: true });
await writeFile(
  'dist/tokens.css',
  ENCABEZADO +
    base.trim() + '\n\n' +
    '/* ══ TEMA OSCURO — base del sitio y del producto ══ */\n' + oscuro.trim() + '\n\n' +
    '/* ══ TEMA CLARO — slides, impresión y modo claro del sitio ══ */\n' + claro.trim() + '\n',
  'utf8',
);

// Salida JS: un objeto plano con los mismos nombres, para consumo desde código.
const aObjeto = (css) =>
  Object.fromEntries(
    [...css.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map(([, k, v]) => [k, v.trim()]),
  );

await writeFile(
  'dist/tokens.js',
  '// Generado por scripts/build.mjs — no editar a mano.\n' +
    `export const base = ${JSON.stringify(aObjeto(base), null, 2)};\n\n` +
    `export const dark = ${JSON.stringify(aObjeto(oscuro), null, 2)};\n\n` +
    `export const light = ${JSON.stringify(aObjeto(claro), null, 2)};\n\n` +
    'export default { base, dark, light };\n',
  'utf8',
);

await rm('dist/.tmp', { recursive: true, force: true });

const total = Object.keys(aObjeto(base)).length + Object.keys(aObjeto(oscuro)).length;
console.log(`✓ dist/tokens.css y dist/tokens.js — ${total} variables`);
