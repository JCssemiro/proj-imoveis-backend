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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametrosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parametros_service_1 = require("./parametros.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let ParametrosController = class ParametrosController {
    constructor(parametros) {
        this.parametros = parametros;
    }
    async getAll() {
        return this.parametros.getAll();
    }
    getFinalidadeUso(pagina, tamanho) {
        return this.parametros.getFinalidadeUsoPaginado({ pagina, tamanho });
    }
    getFinalidadeContratacao(pagina, tamanho) {
        return this.parametros.getFinalidadeContratacaoPaginado({ pagina, tamanho });
    }
    getTiposImovel(pagina, tamanho) {
        return this.parametros.getTiposImovelPaginado({ pagina, tamanho });
    }
    getMobilias(pagina, tamanho) {
        return this.parametros.getMobiliasPaginado({ pagina, tamanho });
    }
    getUrgencia(pagina, tamanho) {
        return this.parametros.getUrgenciaPaginado({ pagina, tamanho });
    }
    getPlanos(pagina, tamanho) {
        return this.parametros.getPlanosPaginado({ pagina, tamanho });
    }
};
exports.ParametrosController = ParametrosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos os parâmetros',
        description: 'Cada parâmetro usa `codigo` (inteiro) como chave. No interesse envie: finalidadeContratacaoCodigo, finalidadeUsoCodigo, tipoImovelCodigo, mobiliaCodigo, urgenciaCodigo, aceitaFinanciamento (boolean), quartos e suites (arrays de inteiros, ex.: quantidades aceitas).',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('finalidadeuso'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalidade de uso (Residencial / Comercial)' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getFinalidadeUso", null);
__decorate([
    (0, common_1.Get)('finalidadecontratacao'),
    (0, swagger_1.ApiOperation)({ summary: 'Compra ou Aluguel' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getFinalidadeContratacao", null);
__decorate([
    (0, common_1.Get)('tipoimovel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Tipos de imóvel',
        description: 'Inclui finalidadeUsoCodigo do grupo.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getTiposImovel", null);
__decorate([
    (0, common_1.Get)('mobilia'),
    (0, swagger_1.ApiOperation)({ summary: 'Mobília' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getMobilias", null);
__decorate([
    (0, common_1.Get)('urgencia'),
    (0, swagger_1.ApiOperation)({ summary: 'Urgência' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getUrgencia", null);
__decorate([
    (0, common_1.Get)('plano'),
    (0, swagger_1.ApiOperation)({
        summary: 'Planos de corretores',
        description: 'precoMensal em reais. PATCH /usuario/plano envia planoCodigo.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getPlanos", null);
exports.ParametrosController = ParametrosController = __decorate([
    (0, swagger_1.ApiTags)('Parâmetros'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('parametros'),
    __metadata("design:paramtypes", [parametros_service_1.ParametrosService])
], ParametrosController);
//# sourceMappingURL=parametros.controller.js.map