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
exports.PaginationQueryDto = void 0;
exports.getPaginationParams = getPaginationParams;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const PADRAO_TAMANHO = 20;
const PADRAO_PAGINA = 1;
const MAX_TAMANHO = 100;
class PaginationQueryDto {
    constructor() {
        this.pagina = PADRAO_PAGINA;
        this.tamanho = PADRAO_TAMANHO;
    }
}
exports.PaginationQueryDto = PaginationQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número da página (1-based). Padrão: 1',
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "pagina", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantidade de itens por página. Padrão: 20',
        default: 20,
        minimum: 1,
        maximum: 100,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_TAMANHO),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "tamanho", void 0);
function getPaginationParams(query) {
    const paginaRaw = query.pagina;
    const tamanhoRaw = query.tamanho;
    const pagina = paginaRaw !== undefined && paginaRaw !== '' ? Math.max(1, Number(paginaRaw) || PADRAO_PAGINA) : PADRAO_PAGINA;
    const tamanho = tamanhoRaw !== undefined && tamanhoRaw !== ''
        ? Math.min(MAX_TAMANHO, Math.max(1, Number(tamanhoRaw) || PADRAO_TAMANHO))
        : PADRAO_TAMANHO;
    const skip = (pagina - 1) * tamanho;
    return { page: pagina, size: tamanho, skip };
}
//# sourceMappingURL=pagination-query.dto.js.map