"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const swagger_docs_controller_1 = require("./swagger-docs.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const throttler_2 = require("@nestjs/throttler");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const interests_module_1 = require("./interests/interests.module");
const leads_module_1 = require("./leads/leads.module");
const conversations_module_1 = require("./conversations/conversations.module");
const brokers_module_1 = require("./brokers/brokers.module");
const parametros_module_1 = require("./parametros/parametros.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        controllers: [app_controller_1.AppController, swagger_docs_controller_1.SwaggerDocsController],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_2.ThrottlerGuard },
        ],
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'short', ttl: 1000, limit: 10 },
                { name: 'medium', ttl: 10000, limit: 50 },
                { name: 'long', ttl: 60000, limit: 100 },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            interests_module_1.InterestsModule,
            leads_module_1.LeadsModule,
            conversations_module_1.ConversationsModule,
            brokers_module_1.BrokersModule,
            parametros_module_1.ParametrosModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map