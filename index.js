/**
 * Wrapper Vercel quando Root Directory = repositório (não "api").
 * Neste caso a função é api/index.js e __dirname = pasta api; build em ./dist/src/index.js
 */
const path = require('path');
const fs = require('fs');

const distSrc = path.join(__dirname, 'dist', 'src', 'index.js');
const distRoot = path.join(__dirname, 'dist', 'index.js');
const distIndex = fs.existsSync(distSrc) ? distSrc : (fs.existsSync(distRoot) ? distRoot : null);

if (!distIndex) {
  throw new Error(
    'Build não encontrado. Execute "npm run build" na pasta api. Esperado: dist/src/index.js'
  );
}

const handler = require(distIndex).default;
module.exports = typeof handler === 'function' ? handler : require(distIndex);
