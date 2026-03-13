// Wrapper para a Vercel: re-exporta o handler do build Nest (dist/index.js).
// Todas as rotas são encaminhadas para esta função via rewrites no vercel.json.
module.exports = require('../dist/index').default;
