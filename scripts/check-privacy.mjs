/**
 * Datos identificables de cliente. Sale con código 1 si encuentra alguno.
 *
 * ⚠️ ESTE REPO ES PÚBLICO. Acá la barrera no es preventiva: cualquier cosa que entre
 * queda visible para cualquiera, y en el historial de git para siempre.
 *
 * El chequeo es idéntico al de `content` a propósito — la fuente de la que se copió
 * está en content/scripts/check-privacy.mjs. Si cambiás un patrón, cambialo en los
 * dos. Se aceptó la duplicación en vez de un paquete compartido porque son dos
 * archivos y un paquete para eso es más maquinaria que problema.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const IGNORAR = ['.git', 'node_modules', 'scripts', 'fonts'];

/**
 * Cada patrón describe una forma concreta en que un dato de cliente entra al repo.
 * Se apunta a formatos, no a nombres: una lista de clientes prohibidos sería ella
 * misma el dato que se quiere proteger.
 */
const PATRONES = [
  {
    nombre: 'RPU de CFE',
    // Un RPU real son 12 dígitos seguidos, a veces con el sufijo de servicio.
    re: /\b\d{12}\b/g,
    nota: 'doce dígitos seguidos parecen un RPU',
  },
  {
    nombre: 'Número y nombre de sucursal',
    // El formato del material de origen: «267 - Constituyentes», con espacios.
    // Exigir al menos un espacio alrededor del guion evita disparar con cosas como
    // «600-Math» (un peso tipográfico) o «2024-Enero». El costo es que un
    // «267-Constituyentes` sin espacios pasaría: se aceptó porque el formato real
    // del material los lleva, y un patrón que grita en cada falso positivo se
    // termina silenciando entero.
    re: /\b\d{2,4}(?:\s+[-–]\s*|\s*[-–]\s+)[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{3,}\b/g,
    nota: 'formato «número - Nombre», como venía en las capturas',
  },
  {
    nombre: 'Monto en pesos con centavos',
    // Un importe exacto de recibo, distinto de una cifra redonda de argumento.
    re: /\$\s?\d{1,3}(?:,\d{3})+\.\d{2}\b/g,
    nota: 'un importe al centavo sale de un recibo, no de un argumento',
  },
  {
    nombre: 'Correo de persona identificable',
    // El TLD tiene que terminar en letras: así un tag de versión como
    // «brand@v1.0.0» —que también es algo@algo.algo— no dispara.
    // Se excluye el local-part `git` EXACTO: `git@github.com` no es el correo de
    // nadie, es el usuario SSH de los hosts de git, y aparece en cualquier `git
    // clone` de la documentación y en package-lock.json. Sin esta exclusión el
    // chequeo grita en falso, y un chequeo que grita en falso se termina silenciando
    // entero. Un `algogit@dominio.com` sigue disparando: la exclusión es del
    // local-part completo, no de un prefijo.
    re: /\b(?!git@)[\w.+-]+@(?!riemann\.energy\b)[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}\b/gi,
    nota: 'correo fuera del dominio propio',
  },
];

async function archivos(dir) {
  const out = [];
  for (const entrada of await readdir(dir, { withFileTypes: true })) {
    if (IGNORAR.includes(entrada.name)) continue;
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) out.push(...(await archivos(ruta)));
    else if (['.md', '.json', '.html', '.txt', '.svg', '.css'].includes(extname(entrada.name))) out.push(ruta);
  }
  return out;
}

const hallazgos = [];

for (const ruta of await archivos('.')) {
  const texto = await readFile(ruta, 'utf8');
  const lineas = texto.split('\n');
  for (const { nombre, re, nota } of PATRONES) {
    lineas.forEach((linea, i) => {
      for (const m of linea.matchAll(re)) {
        hallazgos.push(`${ruta}:${i + 1}  ${nombre} — ${nota}\n     ${linea.trim().slice(0, 76)}`);
      }
    });
  }
}

if (hallazgos.length) {
  console.error(
    `\n❌ ${hallazgos.length} posible(s) dato(s) de cliente:\n\n   ${hallazgos.join('\n\n   ')}\n\n` +
      '   Si es un falso positivo, ajustá el patrón en scripts/check-privacy.mjs\n' +
      '   y dejá dicho por qué. No lo silencies caso por caso.\n',
  );
  process.exit(1);
}
console.log('✅ privacidad: sin datos identificables de cliente');
