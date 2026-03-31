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
exports.PaginatedResponseDto = void 0;
exports.buildPaginatedResponse = buildPaginatedResponse;
const swagger_1 = require("@nestjs/swagger");
class PaginatedResponseDto {
    constructor(paginaAtual, totalPaginas, qtdElementos, conteudo) {
        this.paginaAtual = paginaAtual;
        this.totalPaginas = totalPaginas;
        this.qtdElementos = qtdElementos;
        this.conteudo = conteudo;
    }
}
exports.PaginatedResponseDto = PaginatedResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Página atual (1-based)' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "paginaAtual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total de páginas' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "totalPaginas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantidade total de elementos (todas as páginas)' }),
    __metadata("design:type", Number)
], PaginatedResponseDto.prototype, "qtdElementos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Itens da página atual', isArray: true }),
    __metadata("design:type", Array)
], PaginatedResponseDto.prototype, "conteudo", void 0);
function buildPaginatedResponse(page, size, total, conteudo) {
    const totalPaginas = size > 0 ? Math.ceil(total / size) : 0;
    return new PaginatedResponseDto(page, totalPaginas, total, conteudo);
}
//# sourceMappingURL=paginated-response.dto.js.map