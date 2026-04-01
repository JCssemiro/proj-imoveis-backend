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
exports.CreateInterestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const localizacao_interesse_dto_1 = require("./localizacao-interesse.dto");
const MAX_CODIGO = 2147483647;
class CreateInterestDto {
}
exports.CreateInterestDto = CreateInterestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Localizações',
        type: [localizacao_interesse_dto_1.LocalizacaoInteresseDto],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => localizacao_interesse_dto_1.LocalizacaoInteresseDto),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "localizacoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código em GET /parametros/finalidadecontratacao', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_CODIGO),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "finalidadeContratacaoCodigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código em GET /parametros/finalidadeuso', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_CODIGO),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "finalidadeUsoCodigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código em GET /parametros/tipoimovel (mesmo finalidadeUsoCodigo)', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_CODIGO),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "tipoImovelCodigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código em GET /parametros/mobilia', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_CODIGO),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "mobiliaCodigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código em GET /parametros/urgencia', example: 1 }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(MAX_CODIGO),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "urgenciaCodigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aceita financiamento' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateInterestDto.prototype, "aceitaFinanciamento", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantidades de quartos aceitas (ex.: [1,2] para 1 ou 2 quartos)',
        type: [Number],
        example: [1, 2],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(50, { each: true }),
    (0, class_validator_1.ArrayMaxSize)(30),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "quartos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Quantidades de suítes aceitas',
        type: [Number],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.Min)(0, { each: true }),
    (0, class_validator_1.Max)(50, { each: true }),
    (0, class_validator_1.ArrayMaxSize)(30),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "suites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Metragem (m²)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "metragem", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "valorMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "valorMaximo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Observações com no máximo 5000 caracteres' }),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "observacoes", void 0);
//# sourceMappingURL=create-interest.dto.js.map