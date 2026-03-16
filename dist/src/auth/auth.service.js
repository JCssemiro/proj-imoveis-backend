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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const SALT_ROUNDS = 10;
let AuthService = class AuthService {
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async login(dto) {
        const user = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
        if (!user || user.type !== dto.type) {
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid)
            throw new common_1.UnauthorizedException('E-mail ou senha inválidos');
        return this.buildAuthResponse(user);
    }
    async registerClient(dto) {
        const existing = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.prisma.usuario.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                cpf: dto.cpf,
                passwordHash,
                type: client_1.UserType.client,
            },
        });
        return this.buildAuthResponse(user);
    }
    async registerBroker(dto) {
        const existing = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.prisma.usuario.create({
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                creci: dto.creci,
                passwordHash,
                type: client_1.UserType.broker,
                subscriptionActive: dto.subscriptionActive ?? true,
            },
        });
        return this.buildAuthResponse(user);
    }
    async forgotPassword(dto) {
        const user = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
        if (!user)
            return;
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.usuario.update({
            where: { id: user.id },
            data: { resetPasswordToken: token, resetPasswordExpires: expires },
        });
    }
    buildAuthResponse(user) {
        const token = this.jwt.sign({ sub: user.id, email: user.email, type: user.type }, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cpf: user.cpf,
                type: user.type,
                avatar: user.avatar,
                creci: user.creci,
                subscriptionActive: user.subscriptionActive,
            },
            token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map