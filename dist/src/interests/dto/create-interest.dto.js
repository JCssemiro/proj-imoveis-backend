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
const compraOuAluguel = ['compra', 'aluguel'];
const finalidade = ['residencial', 'comercial'];
const tipoImovel = [
    'terreno_via_publica',
    'terreno_condominio',
    'casa_condominio',
    'casa_via_publica',
    'galpao',
    'apartamento',
    'sobrado',
    'outro',
];
const tipoCasa = ['sobrado', 'terreo', ''];
const quartos = ['0', '1', '2', '3', '4', '5', '6+'];
const suites = ['0', '1', '2', '3', '4+'];
const mobilia = ['100_mobiliado', 'somente_planejados', 'sem_mobilia'];
class CreateInterestDto {
}
exports.CreateInterestDto = CreateInterestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Regiões de interesse', example: ['Centro', 'Zona Sul'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "localizacoes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: compraOuAluguel }),
    (0, class_validator_1.IsIn)(compraOuAluguel),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "compraOuAluguel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: finalidade }),
    (0, class_validator_1.IsIn)(finalidade),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "finalidade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tipoImovel }),
    (0, class_validator_1.IsIn)(tipoImovel),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "tipoImovel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: tipoCasa }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(tipoCasa),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "tipoCasa", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: quartos }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(quartos),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "quartos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: suites }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(suites),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "suites", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "banheiros", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "garagens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "metragemTerreno", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "areaConstruida", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: mobilia }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(mobilia),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "mobilia", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "valorMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ minimum: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInterestDto.prototype, "valorMaximo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateInterestDto.prototype, "caracteristicas", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInterestDto.prototype, "observacoes", void 0);
//# sourceMappingURL=create-interest.dto.js.map