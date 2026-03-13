// Wrapper para a Vercel: re-exporta o handler do build Nest (dist/src/index.js).
// Todas as rotas são encaminhadas para esta função via rewrites no vercel.json.
const handler = require('../dist/src/index').default;
module.exports = handler;
