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
const decimal_1 = require("../common/utils/decimal");
let ParametrosService = class ParametrosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async paginateParam(model, pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const delegate = this.prisma[model];
        const [total, rows] = await Promise.all([
            delegate.count({ where }),
            delegate.findMany({
                where,
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true },
                skip,
                take: size,
            }),
        ]);
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, rows);
    }
    async getFinalidadeUsoPaginado(pagination) {
        return this.paginateParam('finalidadeuso', pagination);
    }
    async getFinalidadeContratacaoPaginado(pagination) {
        return this.paginateParam('finalidadecontratacao', pagination);
    }
    async getTiposImovelPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.tipoimovel.count({ where }),
            this.prisma.tipoimovel.findMany({
                where,
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true, finalidadeusocodigo: true },
                skip,
                take: size,
            }),
        ]);
        const conteudo = rows.map((r) => ({
            codigo: r.codigo,
            nome: r.nome,
            finalidadeUsoCodigo: r.finalidadeusocodigo,
        }));
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async getMobiliasPaginado(pagination) {
        return this.paginateParam('mobilia', pagination);
    }
    async getUrgenciaPaginado(pagination) {
        return this.paginateParam('urgencia', pagination);
    }
    async getPlanosPaginado(pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = { ativo: true };
        const [total, rows] = await Promise.all([
            this.prisma.plano.count({ where }),
            this.prisma.plano.findMany({
                where,
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true, precomensal: true },
                skip,
                take: size,
            }),
        ]);
        const conteudo = rows.map((r) => ({
            codigo: r.codigo,
            nome: r.nome,
            precoMensal: (0, decimal_1.decimalToNumber)(r.precomensal),
        }));
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async getAll() {
        const [finalidadeuso, finalidadecontratacao, tipoimovel, mobilia, urgencia, planos] = await Promise.all([
            this.prisma.finalidadeuso.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true },
            }),
            this.prisma.finalidadecontratacao.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true },
            }),
            this.prisma.tipoimovel.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true, finalidadeusocodigo: true },
            }),
            this.prisma.mobilia.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true },
            }),
            this.prisma.urgencia.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true },
            }),
            this.prisma.plano.findMany({
                where: { ativo: true },
                orderBy: { nome: 'asc' },
                select: { codigo: true, nome: true, precomensal: true },
            }),
        ]);
        return {
            finalidadeuso,
            finalidadecontratacao,
            tipoimovel: tipoimovel.map((r) => ({
                codigo: r.codigo,
                nome: r.nome,
                finalidadeUsoCodigo: r.finalidadeusocodigo,
            })),
            mobilia,
            urgencia,
            plano: planos.map((p) => ({
                codigo: p.codigo,
                nome: p.nome,
                precoMensal: (0, decimal_1.decimalToNumber)(p.precomensal),
            })),
        };
    }
};
exports.ParametrosService = ParametrosService;
exports.ParametrosService = ParametrosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParametrosService);
//# sourceMappingURL=parametros.service.js.map