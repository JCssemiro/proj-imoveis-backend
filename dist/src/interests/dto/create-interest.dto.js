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
class CreateInterestDto {
}
exports.CreateInterestDto = CreateInterestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Localizações de interesse (CEP, município cod IBGE, bairro)',
        type: [localizacao_interesse_dto_1.LocalizacaoInteresseDto],
        example: [{ cep: '01310100', bairro: 'Bela Vista' }, { municipiocodibge: '3550308' }],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => localizacao_interesse_dto_1.LocalizacaoInteresseDto),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "localizacoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compra ou aluguel. Valores: compra | aluguel (obter de GET /parametros/compraoualuguel)',
        enum: ['compra', 'aluguel'],
    }),
    (0, class_validator_1.IsIn)(['compra', 'aluguel']),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "compraOuAluguel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID da finalidade (obter de GET /parametros/finalidade)',
        example: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "finalidadeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID do tipo de imóvel (obter de GET /parametros/tipoimovel)',
        example: 'uuid',
    }),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "tipoImovelId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID do tipo de casa (obter de GET /parametros/tipocasa). Se omitido, usa o primeiro ativo por ordem.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "tipoCasaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quantidade de quartos (ex: 2, 6+)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "quartos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Quantidade de suítes (ex: 1, 4+)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "suites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "banheiros", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "garagens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "metragemTerreno", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "areaConstruida", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID da mobília (obter de GET /parametros/mobilia). Se omitido, usa o primeiro ativo por ordem.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4'),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "mobiliaId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "valorMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], CreateInterestDto.prototype, "valorMaximo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'IDs das features (obter de GET /parametros/feature). Array de UUID.',
        type: [String],
        example: ['uuid1', 'uuid2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "featureIds", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ maxLength: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000, { message: 'Observações com no máximo 5000 caracteres' }),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "observacoes", void 0);
//# sourceMappingURL=create-interest.dto.js.map