/**
 * Contraste WCAG 2.1 sobre los tokens generados, en los dos temas.
 * Sale con código 1 si algún par obligatorio no pasa: es una barrera de CI, no un reporte.
 *
 * Lo que este chequeo NO cubre: la separación entre colores funcionales — que dos insumos
 * adyacentes se distingan entre sí. Eso necesita distancia en OKLCH, no contraste WCAG, y
 * es una auditoría aparte.
 */
import { readFile } from 'node:fs/promises';

const AA_TEXTO = 4.5;   // texto normal
const AA_GRANDE = 3.0;  // texto ≥24px, o ≥18.7px en negrita, y elementos no textuales

/** Pares que deben pasar, con su umbral. Se evalúan en ambos temas. */
const PARES = [
  ['color-fg-default',  'color-bg-default',     AA_TEXTO,  'texto principal sobre el fondo'],
  ['color-fg-default',  'color-bg-surface',     AA_TEXTO,  'texto principal sobre superficie'],
  ['color-fg-muted',    'color-bg-default',     AA_TEXTO,  'texto secundario sobre el fondo'],
  ['color-fg-muted',    'color-bg-surface',     AA_TEXTO,  'texto secundario sobre superficie'],
  ['color-fg-subtle',   'color-bg-default',     AA_GRANDE, 'texto terciario: metadato, pie de gráfica'],
  ['color-accent-on',   'color-accent-default', AA_TEXTO,  'texto dentro del botón de acento'],
  ['color-accent-default', 'color-bg-default',  AA_GRANDE, 'acento como elemento sobre el fondo'],
  ['color-status-critical', 'color-bg-default', AA_GRANDE, 'estado crítico'],
  ['color-status-warning',  'color-bg-default', AA_GRANDE, 'estado alerta'],
  ['color-status-info',     'color-bg-default', AA_GRANDE, 'estado info'],
  ['color-status-success',  'color-bg-default', AA_GRANDE, 'estado ok'],
  ['color-utility-electricity', 'color-bg-default', AA_GRANDE, 'insumo electricidad'],
  ['color-utility-gas',         'color-bg-default', AA_GRANDE, 'insumo gas'],
  ['color-utility-diesel',      'color-bg-default', AA_GRANDE, 'insumo diésel'],
  ['color-utility-water',       'color-bg-default', AA_GRANDE, 'insumo agua'],
  ['color-utility-waste',       'color-bg-default', AA_GRANDE, 'insumo residuos'],
];

const canal = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

function luminancia(hex) {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? [...h].map((c) => c + c) : h.match(/../g);
  const [r, g, b] = n.slice(0, 3).map((v) => canal(parseInt(v, 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const css = await readFile(new URL('../dist/tokens.css', import.meta.url), 'utf8');

function bloque(selector) {
  const i = css.indexOf(selector);
  if (i === -1) throw new Error(`No se encontró el bloque ${selector} en dist/tokens.css`);
  const cuerpo = css.slice(css.indexOf('{', i), css.indexOf('}', css.indexOf('{', i)));
  return Object.fromEntries(
    [...cuerpo.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(([, k, v]) => [k, v.trim()]),
  );
}

const temas = {
  oscuro: bloque('[data-theme="dark"]'),
  claro: bloque('[data-theme="light"]'),
};

let fallos = 0;
let evaluados = 0;

for (const [nombreTema, tokens] of Object.entries(temas)) {
  console.log(`\n  tema ${nombreTema}`);
  for (const [frente, fondo, umbral, descripcion] of PARES) {
    const a = tokens[frente];
    const b = tokens[fondo];
    if (!a || !b) {
      console.log(`  ⚠️  falta ${!a ? frente : fondo} — par no evaluado`);
      continue;
    }
    evaluados++;
    const r = ratio(a, b);
    const pasa = r >= umbral;
    if (!pasa) fallos++;
    console.log(
      `  ${pasa ? '✓' : '✗'} ${r.toFixed(2).padStart(5)} / ${umbral.toFixed(1)}  ${descripcion}`,
    );
  }
}

console.log(
  fallos
    ? `\n❌ ${fallos} de ${evaluados} pares NO pasan\n`
    : `\n✅ ${evaluados}/${evaluados} pares pasan en ambos temas\n`,
);
process.exit(fallos ? 1 : 0);
