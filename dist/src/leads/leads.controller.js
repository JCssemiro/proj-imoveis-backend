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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leads_service_1 = require("./leads.service");
const update_lead_dto_1 = require("./dto/update-lead.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let LeadsController = class LeadsController {
    constructor(leads) {
        this.leads = leads;
    }
    findAll(_brokerId, pagina, tamanho, status, tipoImovelCodigo, finalidadeContratacaoCodigo, finalidadeUsoCodigo, mobiliaCodigo, compraOuAluguel, regiao, minPrice, maxPrice, dataInicio, dataFim) {
        return this.leads.findAll(_brokerId, {
            status,
            tipoImovelCodigo,
            finalidadeContratacaoCodigo,
            finalidadeUsoCodigo,
            mobiliaCodigo,
            compraOuAluguel,
            regiao,
            minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
            dataInicio,
            dataFim,
        }, { pagina, tamanho });
    }
    findOne(id, _brokerId) {
        return this.leads.findOne(id, _brokerId);
    }
    update(id, dto, _brokerId) {
        return this.leads.update(id, dto, _brokerId);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar leads (interesses) paginado',
        description: 'O id do lead é o UUID do interesse. Filtro status: 1–4 (1=novo … 4=encerrado); sem status, exclui encerrados. Demais filtros: códigos de GET /parametros. compraOuAluguel: compra|aluguel.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: '1–4 (opcional; padrão lista sem status 4)' }),
    (0, swagger_1.ApiQuery)({ name: 'tipoImovelCodigo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'finalidadeContratacaoCodigo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'finalidadeUsoCodigo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'mobiliaCodigo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'compraOuAluguel', required: false, enum: ['compra', 'aluguel'] }),
    (0, swagger_1.ApiQuery)({ name: 'regiao', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dataInicio', required: false, description: 'ISO 8601' }),
    (0, swagger_1.ApiQuery)({ name: 'dataFim', required: false, description: 'ISO 8601' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('pagina')),
    __param(2, (0, common_1.Query)('tamanho')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('tipoImovelCodigo')),
    __param(5, (0, common_1.Query)('finalidadeContratacaoCodigo')),
    __param(6, (0, common_1.Query)('finalidadeUsoCodigo')),
    __param(7, (0, common_1.Query)('mobiliaCodigo')),
    __param(8, (0, common_1.Query)('compraOuAluguel')),
    __param(9, (0, common_1.Query)('regiao')),
    __param(10, (0, common_1.Query)('minPrice')),
    __param(11, (0, common_1.Query)('maxPrice')),
    __param(12, (0, common_1.Query)('dataInicio')),
    __param(13, (0, common_1.Query)('dataFim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar lead (interesse) por UUID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar status do lead (1–4)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lead_dto_1.UpdateLeadDto, String]),
    __metadata("design:returntype", void 0)
], LeadsController.prototype, "update", null);
exports.LeadsController = LeadsController = __decorate([
    (0, swagger_1.ApiTags)('Prospecto'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('prospecto'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('broker'),
    __metadata("design:paramtypes", [leads_service_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leads.controller.js.map