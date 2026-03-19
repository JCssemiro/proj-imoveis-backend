import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, Matches, ValidateIf } from 'class-validator';

export class LocalizacaoInteresseDto {
  @ApiPropertyOptional({ description: 'CEP (8 dígitos, com ou sem hífen)' })
  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsString()
  @MaxLength(9)
  @Matches(/^\d{5}-?\d{3}$|^\d{8}$/, {
    message: 'CEP deve conter 8 dígitos (opcionalmente no formato 00000-000)',
  })
  cep?: string;

  @ApiPropertyOptional({ description: 'Código IBGE do município (até 7 dígitos)' })
  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsString()
  @MaxLength(7)
  @Matches(/^\d{1,7}$/, { message: 'Código IBGE deve conter apenas dígitos' })
  municipiocodibge?: string;

  @ApiPropertyOptional({ description: 'Bairro' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bairro?: string;
}
