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
exports.LocalizacaoInteresseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LocalizacaoInteresseDto {
}
exports.LocalizacaoInteresseDto = LocalizacaoInteresseDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'CEP (8 dígitos, com ou sem hífen)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_, v) => v != null && v !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(9),
    (0, class_validator_1.Matches)(/^\d{5}-?\d{3}$|^\d{8}$/, {
        message: 'CEP deve conter 8 dígitos (opcionalmente no formato 00000-000)',
    }),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "cep", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Logradouro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "logradouro", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bairro' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cidade' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'UF (2 letras)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_, v) => v != null && v !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2),
    (0, class_validator_1.Matches)(/^[A-Za-z]{2}$/, { message: 'UF deve ter 2 letras' }),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "uf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Código IBGE da cidade (até 7 dígitos)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_, v) => v != null && v !== ''),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(10),
    (0, class_validator_1.Matches)(/^\d{1,10}$/, { message: 'Código IBGE deve conter apenas dígitos' }),
    __metadata("design:type", String)
], LocalizacaoInteresseDto.prototype, "codIbgeCidade", void 0);
//# sourceMappingURL=localizacao-interesse.dto.js.map