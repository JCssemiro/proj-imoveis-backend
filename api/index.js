// Wrapper para a Vercel: re-exporta o handler do build Nest.
// Nest (sourceRoot: "src") compila para dist/src/index.js.
// Na Vercel: definir Root Directory = "api" para que build e função usem este projeto.
const path = require('path');
const fs = require('fs');

const distSrc = path.resolve(__dirname, '../dist/src/index.js');
const distRoot = path.resolve(__dirname, '../dist/index.js');
const distIndex = fs.existsSync(distSrc) ? distSrc : (fs.existsSync(distRoot) ? distRoot : null);

if (!distIndex) {
  throw new Error(
    'Build não encontrado. Esperado: dist/src/index.js ou dist/index.js. ' +
    'Execute "npm run build" e confira se Root Directory na Vercel está definido como "api".'
  );
}

const handler = require(distIndex).default;
if (typeof handler !== 'function') {
  throw new Error('dist/src/index.js não exporta um default function (handler).');
}
module.exports = handler;
