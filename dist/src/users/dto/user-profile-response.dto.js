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
exports.UserProfileResponseDto = exports.UserPlanResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserPlanResponseDto {
}
exports.UserPlanResponseDto = UserPlanResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código do plano (GET /parametros/plano)' }),
    __metadata("design:type", Number)
], UserPlanResponseDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserPlanResponseDto.prototype, "nome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor mensal em reais' }),
    __metadata("design:type", Number)
], UserPlanResponseDto.prototype, "precoMensal", void 0);
class UserProfileResponseDto {
}
exports.UserProfileResponseDto = UserProfileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['client', 'broker'] }),
    __metadata("design:type", String)
], UserProfileResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, description: 'Somente corretores' }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "creci", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, description: 'Somente corretores' }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "subscriptionActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: UserPlanResponseDto,
        nullable: true,
        description: 'Dados do plano quando o usuário é corretor e possui planocodigo; para clientes ou sem plano: null',
    }),
    __metadata("design:type", Object)
], UserProfileResponseDto.prototype, "plan", void 0);
//# sourceMappingURL=user-profile-response.dto.js.map