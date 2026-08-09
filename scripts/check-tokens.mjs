/**
 * Reglas del sistema que ninguna herramienta verifica sola.
 * Sale con código 1 si alguna se rompe: es barrera de CI, no reporte.
 *
 * Cada regla está acá porque el error que atrapa ya ocurrió al menos una vez.
 */
import { readFile, readdir } from 'node:fs/promises';

const fallos = [];
const falla = (regla, detalle) => fallos.push(`${regla}\n     ${detalle}`);

const leerJson = async (ruta) => JSON.parse(await readFile(ruta, 'utf8'));

/** Recorre un árbol DTCG y llama fn(ruta, token) en cada hoja con $value. */
function recorrer(nodo, fn, ruta = []) {
  for (const [clave, valor] of Object.entries(nodo)) {
    if (clave.startsWith('$')) continue;
    if (valor && typeof valor === 'object') {
      if ('$value' in valor) fn(ruta.concat(clave).join('.'), valor);
      else recorrer(valor, fn, ruta.concat(clave));
    }
  }
}

// ── 1 · Los semánticos no escriben colores: los referencian ──────────────────
// Un hex suelto en la capa semántica rompe la propiedad que justifica tener dos
// capas — que cambiar un color sea UN valor y no una búsqueda.
const semanticos = (await readdir('tokens/semantic')).filter((f) => f.endsWith('.json'));
for (const archivo of semanticos) {
  const json = await leerJson(`tokens/semantic/${archivo}`);
  recorrer(json, (ruta, token) => {
    if (token.$type !== 'color') return;
    if (!/^\{.+\}$/.test(String(token.$value).trim())) {
      falla('Color escrito a mano en la capa semántica', `${archivo} · ${ruta} = ${token.$value}`);
    }
  });
}

// ── 2 · Todo grupo semántico se explica ──────────────────────────────────────
// Los comentarios del sistema guardan decisiones de diseño que no se pueden perder:
// por qué el ámbar se corrió 24°, por qué en tema claro el CTA se invierte.
for (const archivo of semanticos) {
  const json = await leerJson(`tokens/semantic/${archivo}`);
  if (!json.$description) falla('Archivo sin $description', `tokens/semantic/${archivo}`);
}

// ── 3 · Toda referencia resuelve ─────────────────────────────────────────────
const primitivos = {};
for (const archivo of await readdir('tokens/primitives')) {
  recorrer(await leerJson(`tokens/primitives/${archivo}`), (ruta, token) => {
    primitivos[ruta] = token.$value;
  });
}
for (const archivo of semanticos) {
  recorrer(await leerJson(`tokens/semantic/${archivo}`), (ruta, token) => {
    const m = String(token.$value).match(/^\{(.+)\}$/);
    if (m && !(m[1] in primitivos)) {
      falla('Referencia a un primitivo que no existe', `${archivo} · ${ruta} → {${m[1]}}`);
    }
  });
}

// ── 4 · Los assets de marca usan colores del sistema ─────────────────────────
// Esta regla existe porque el favicon tenía un #131614 y el og un #9BA5A0, dos
// grises elegidos a ojo que no existían en ningún token.
const paleta = new Set(Object.values(primitivos).map((v) => String(v).toLowerCase()));
paleta.add('currentcolor');
paleta.add('none');
for (const archivo of (await readdir('brand-assets')).filter((f) => f.endsWith('.svg'))) {
  const svg = await readFile(`brand-assets/${archivo}`, 'utf8');
  // Los hex dentro de comentarios son documentación, no valores aplicados.
  const sinComentarios = svg.replace(/<!--[\s\S]*?-->/g, '');
  for (const [, hex] of sinComentarios.matchAll(/(?:fill|stroke)="(#[0-9a-fA-F]{3,8})"/g)) {
    if (!paleta.has(hex.toLowerCase())) {
      falla('Color fuera del sistema en un asset', `brand-assets/${archivo} · ${hex}`);
    }
  }
}

// ── 5 · Cada tipografía tiene su licencia al lado ────────────────────────────
// Es requisito de la OFL, y este repo es público.
const fuentes = await readdir('fonts');
for (const woff2 of fuentes.filter((f) => f.endsWith('.woff2'))) {
  const familia = woff2.replace(/-latin(-ext)?\.woff2$/, '');
  if (!fuentes.includes(`${familia}-OFL.txt`)) {
    falla('Tipografía sin su licencia OFL', `fonts/${woff2} → falta ${familia}-OFL.txt`);
  }
}

if (fallos.length) {
  console.error(`\n❌ ${fallos.length} regla(s) rota(s):\n\n   ${fallos.join('\n\n   ')}\n`);
  process.exit(1);
}
console.log('✅ reglas del sistema: todo en orden');
