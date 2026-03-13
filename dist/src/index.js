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
    await app.listen(0, '0.0.0.0');
    global.__nestApp__ = app;
    return app;
}
async function handler(req, res) {
    const app = await getApp();
    const fastify = app.getHttpAdapter().getInstance();
    fastify.server.emit('request', req, res);
}
//# sourceMappingURL=index.js.map