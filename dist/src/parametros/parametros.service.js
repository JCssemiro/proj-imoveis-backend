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
exports.ParametrosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
let ParametrosService = class ParametrosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getFinalidades() {
        const rows = await this.prisma.finalidade.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getFinalidadesPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.finalidade.count({ where }),
            this.prisma.finalidade.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getTiposImovel() {
        const rows = await this.prisma.tipoimovel.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getTiposImovelPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.tipoimovel.count({ where }),
            this.prisma.tipoimovel.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getTiposCasa() {
        const rows = await this.prisma.tipocasa.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getTiposCasaPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.tipocasa.count({ where }),
            this.prisma.tipocasa.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getMobilias() {
        const rows = await this.prisma.mobilia.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getMobiliasPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.mobilia.count({ where }),
            this.prisma.mobilia.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getFeatures() {
        const rows = await this.prisma.feature.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getFeaturesPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.feature.count({ where }),
            this.prisma.feature.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getPlanos() {
        const rows = await this.prisma.plano.findMany({
            where: { ativo: true },
            orderBy: { ordem: 'asc' },
            select: { id: true, codigo: true, label: true, ordem: true },
        });
        return rows;
    }
    async getPlanosPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.plano.count({ where }),
            this.prisma.plano.findMany({
                where,
                orderBy: { ordem: 'asc' },
                select: { id: true, codigo: true, label: true, ordem: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    getCompraOuAluguel() {
        return [
            { valor: 'compra', label: 'Compra', ordem: 1 },
            { valor: 'aluguel', label: 'Aluguel', ordem: 2 },
        ];
    }
    async getCompraOuAluguelPaginado(pagination) {
        const { page, size } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const itens = this.getCompraOuAluguel();
        const total = itens.length;
        const start = (page - 1) * size;
        const end = start + size;
        const conteudo = itens.slice(start, end);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async getAll() {
        const [finalidade, tipoimovel, tipocasa, mobilia, feature, plano] = await Promise.all([
            this.getFinalidades(),
            this.getTiposImovel(),
            this.getTiposCasa(),
            this.getMobilias(),
            this.getFeatures(),
            this.getPlanos(),
        ]);
        return {
            finalidade,
            tipoimovel,
            tipocasa,
            mobilia,
            feature,
            plano,
            compraoualuguel: this.getCompraOuAluguel(),
        };
    }
};
exports.ParametrosService = ParametrosService;
exports.ParametrosService = ParametrosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParametrosService);
//# sourceMappingURL=parametros.service.js.map