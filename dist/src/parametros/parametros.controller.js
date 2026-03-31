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
    async getFinalidades(pagina, tamanho) {
        return this.parametros.getFinalidadesPaginado({ pagina, tamanho });
    }
    async getTiposImovel(pagina, tamanho) {
        return this.parametros.getTiposImovelPaginado({ pagina, tamanho });
    }
    async getTiposCasa(pagina, tamanho) {
        return this.parametros.getTiposCasaPaginado({ pagina, tamanho });
    }
    async getMobilias(pagina, tamanho) {
        return this.parametros.getMobiliasPaginado({ pagina, tamanho });
    }
    async getFeatures(pagina, tamanho) {
        return this.parametros.getFeaturesPaginado({ pagina, tamanho });
    }
    async getPlanos(pagina, tamanho) {
        return this.parametros.getPlanosPaginado({ pagina, tamanho });
    }
    getCompraOuAluguel(pagina, tamanho) {
        return this.parametros.getCompraOuAluguelPaginado({ pagina, tamanho });
    }
};
exports.ParametrosController = ParametrosController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos os parâmetros',
        description: 'Retorna todos os parâmetros em uma chamada. Nos payloads de interesse use o campo "id" (UUID) para finalidadeId, tipoImovelId, tipoCasaId, mobiliaId e featureIds. compraOuAluguel usa "valor" (compra|aluguel).',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('finalidade'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar finalidades',
        description: 'Parâmetros para finalidadeId no cadastro de interesse. Enviar o "id" (UUID) no body.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getFinalidades", null);
__decorate([
    (0, common_1.Get)('tipoimovel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar tipos de imóvel',
        description: 'Parâmetros para tipoImovelId no cadastro de interesse e query tipoImovelId no filtro de leads. Enviar o "id" (UUID).',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getTiposImovel", null);
__decorate([
    (0, common_1.Get)('tipocasa'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar tipos de casa',
        description: 'Parâmetros para tipoCasaId no cadastro de interesse. Enviar o "id" (UUID).',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getTiposCasa", null);
__decorate([
    (0, common_1.Get)('mobilia'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar opções de mobília',
        description: 'Parâmetros para mobiliaId no cadastro de interesse. Enviar o "id" (UUID).',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getMobilias", null);
__decorate([
    (0, common_1.Get)('feature'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar features (características)',
        description: 'Parâmetros para featureIds (array de UUID) no cadastro de interesse. Enviar os "id" no array.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getFeatures", null);
__decorate([
    (0, common_1.Get)('plano'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar planos de corretores',
        description: 'Parâmetros para planoid no cadastro de corretor. Enviar o "id" (UUID) do plano.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParametrosController.prototype, "getPlanos", null);
__decorate([
    (0, common_1.Get)('compraoualuguel'),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar opções compra/aluguel',
        description: 'Valores fixos para compraOuAluguel no cadastro de interesse. Enviar o "valor" (compra ou aluguel).',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false, description: 'Página (padrão: 1)' }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ParametrosController.prototype, "getCompraOuAluguel", null);
exports.ParametrosController = ParametrosController = __decorate([
    (0, swagger_1.ApiTags)('Parâmetros'),
    (0, common_1.Controller)('parametros'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [parametros_service_1.ParametrosService])
], ParametrosController);
//# sourceMappingURL=parametros.controller.js.map