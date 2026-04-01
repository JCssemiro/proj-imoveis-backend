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
exports.BrokersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brokers_service_1 = require("./brokers.service");
let BrokersController = class BrokersController {
    constructor(brokers) {
        this.brokers = brokers;
    }
    findAll(pagina, tamanho) {
        return this.brokers.findAll({ pagina, tamanho });
    }
};
exports.BrokersController = BrokersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar corretores (paginado; requer autenticação)' }),
    (0, swagger_1.ApiQuery)({ name: 'pagina', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'tamanho', required: false }),
    __param(0, (0, common_1.Query)('pagina')),
    __param(1, (0, common_1.Query)('tamanho')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BrokersController.prototype, "findAll", null);
exports.BrokersController = BrokersController = __decorate([
    (0, swagger_1.ApiTags)('Corretor'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('corretor'),
    __metadata("design:paramtypes", [brokers_service_1.BrokersService])
], BrokersController);
//# sourceMappingURL=brokers.controller.js.map