"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductionEnv = validateProductionEnv;
exports.createApp = createApp;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
function validateProductionEnv() {
    if (process.env.NODE_ENV === 'production') {
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
            console.error('JWT_SECRET é obrigatório em produção. Defina a variável de ambiente.');
            process.exit(1);
        }
        const unsafe = ['change-me', 'secret', 'jwt_secret'];
        if (unsafe.some((s) => process.env.JWT_SECRET?.toLowerCase().includes(s))) {
            console.error('Use um JWT_SECRET forte e único em produção.');
            process.exit(1);
        }
    }
}
async function createApp() {
    validateProductionEnv();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    app.enableCors({ origin: frontendUrl, credentials: true });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('API')
        .setDescription('API do projeto - gestão de imóveis, leads e conversas.')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/v1/docs', app, document);
    return app;
}
//# sourceMappingURL=app.factory.js.map