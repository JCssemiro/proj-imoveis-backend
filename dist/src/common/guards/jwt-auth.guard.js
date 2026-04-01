"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("../decorators/public.decorator");
const PUBLIC_GET_PATHS = new Set(['/api/v1/health', '/api/v1/docs', '/api/v1/docs-json']);
const PUBLIC_AUTH_POST_PATHS = new Set([
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/recuperar-senha',
]);
function normalizeRequestPath(raw) {
    const withoutQuery = raw.split('?')[0] || '/';
    let pathname = withoutQuery;
    try {
        if (withoutQuery.includes('://'))
            pathname = new URL(withoutQuery).pathname;
    }
    catch {
    }
    const lower = pathname.toLowerCase();
    return lower.length > 1 && lower.endsWith('/') ? lower.slice(0, -1) : lower;
}
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const method = (request.method || 'GET').toUpperCase();
        const rawPath = request.url ?? request.raw?.url ?? request.routerPath ?? request.path ?? '';
        const path = normalizeRequestPath(String(rawPath));
        if (method === 'GET' && PUBLIC_GET_PATHS.has(path))
            return true;
        if (method === 'POST' && PUBLIC_AUTH_POST_PATHS.has(path))
            return true;
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Token inválido ou expirado');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map