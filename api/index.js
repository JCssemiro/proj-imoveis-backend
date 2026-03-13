// Wrapper Vercel quando Root Directory = "api". Função: api/index.js → este arquivo em api/api/index.js.
// Nest compila para dist/src/index.js. NUNCA usar require('../dist/index') — caminho errado.
const path = require('path');
const fs = require('fs');

const distSrc = path.resolve(__dirname, '..', 'dist', 'src', 'index.js');
const distRoot = path.resolve(__dirname, '..', 'dist', 'index.js');
const distIndex = fs.existsSync(distSrc) ? distSrc : (fs.existsSync(distRoot) ? distRoot : null);

if (!distIndex) {
  throw new Error(
    '[ImobiConnect] Build não encontrado. Esperado: dist/src/index.js. ' +
    'Root Directory na Vercel = "api", rodar "npm run build" e fazer Redeploy (Clear cache).'
  );
}

let handler;
try {
  handler = require(distIndex).default;
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND' && (e.message || '').includes('dist/index')) {
    throw new Error(
      '[ImobiConnect] Use o api/api/index.js atual (não require("../dist/index")). ' +
      'Redeploy com "Clear cache and redeploy".'
    );
  }
  throw e;
}
if (typeof handler !== 'function') {
  throw new Error('[ImobiConnect] dist/src/index.js deve exportar default function (handler).');
}
module.exports = handler;
