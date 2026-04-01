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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const decimal_1 = require("../common/utils/decimal");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.usuario.findUnique({
            where: { id: userId },
            include: { plano: true },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return this.toUserResponse(user);
    }
    async updateMe(userId, dto) {
        const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        if (dto.email !== undefined && dto.email !== user.email) {
            const existing = await this.prisma.usuario.findUnique({
                where: { email: dto.email },
            });
            if (existing) {
                throw new common_1.ConflictException('E-mail já está em uso por outra conta');
            }
        }
        if (dto.creci !== undefined && user.tipo === 'broker') {
            const existingCreci = await this.prisma.usuario.findFirst({
                where: { creci: dto.creci, id: { not: userId } },
            });
            if (existingCreci) {
                throw new common_1.ConflictException('CRECI já está em uso por outra conta');
            }
        }
        const updated = await this.prisma.usuario.update({
            where: { id: userId },
            data: {
                ...(dto.name !== undefined && { nome: dto.name }),
                ...(dto.email !== undefined && { email: dto.email }),
                ...(dto.phone !== undefined && { telefone: dto.phone }),
                ...(dto.creci !== undefined && user.tipo === 'broker' && { creci: dto.creci }),
            },
            include: { plano: true },
        });
        return this.toUserResponse(updated);
    }
    async changeBrokerPlan(brokerId, planoCodigo) {
        const user = await this.prisma.usuario.findUnique({ where: { id: brokerId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        if (user.tipo !== 'broker')
            throw new common_1.ForbiddenException('Apenas corretores podem alterar o plano');
        const plan = await this.prisma.plano.findFirst({
            where: { codigo: planoCodigo, ativo: true },
        });
        if (!plan) {
            throw new common_1.BadRequestException('planoCodigo inválido ou inativo. Use um código retornado por GET /parametros/plano.');
        }
        const updated = await this.prisma.usuario.update({
            where: { id: brokerId },
            data: {
                planocodigo: planoCodigo,
                ativoassinatura: true,
            },
            include: { plano: true },
        });
        return this.toUserResponse(updated);
    }
    planFromRow(p) {
        if (!p)
            return null;
        return {
            codigo: p.codigo,
            nome: p.nome,
            precoMensal: (0, decimal_1.decimalToNumber)(p.precomensal),
        };
    }
    toUserResponse(user) {
        return {
            id: user.id,
            name: user.nome,
            email: user.email,
            phone: user.telefone,
            type: user.tipo,
            avatar: user.avatar,
            creci: user.creci,
            subscriptionActive: user.ativoassinatura,
            plan: this.planFromRow(user.plano),
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map