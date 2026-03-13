"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env') });
const app_factory_1 = require("./app.factory");
async function bootstrap() {
    const app = await (0, app_factory_1.createApp)();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
    await app.listen(port, '0.0.0.0');
    console.log(`ImobiConnect API running at http://localhost:${port}/api/v1`);
    console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map