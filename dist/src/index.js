"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env') });
const app_factory_1 = require("./app.factory");
async function getApp() {
    if (global.__nestApp__) {
        return global.__nestApp__;
    }
    const app = await (0, app_factory_1.createApp)();
    await app.init();
    await app.listen(0, '0.0.0.0');
    global.__nestApp__ = app;
    return app;
}
function sendError(res, statusCode, body) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(body);
}
async function handler(req, res) {
    try {
        const app = await getApp();
        const fastify = app.getHttpAdapter().getInstance();
        await fastify.ready();
        fastify.server.emit('request', req, res);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        const code = process.env.NODE_ENV === 'production' ? 500 : 500;
        sendError(res, code, JSON.stringify({ code: 'FUNCTION_INVOCATION_FAILED', message }));
    }
}
//# sourceMappingURL=index.js.map