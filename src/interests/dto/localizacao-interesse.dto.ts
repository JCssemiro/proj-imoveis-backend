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

  @ApiPropertyOptional({ description: 'Logradouro' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  logradouro?: string;

  @ApiPropertyOptional({ description: 'Bairro' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  bairro?: string;

  @ApiPropertyOptional({ description: 'Cidade' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  cidade?: string;

  @ApiPropertyOptional({ description: 'UF (2 letras)' })
  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsString()
  @MaxLength(2)
  @Matches(/^[A-Za-z]{2}$/, { message: 'UF deve ter 2 letras' })
  uf?: string;

  @ApiPropertyOptional({ description: 'Código IBGE da cidade (até 7 dígitos)' })
  @IsOptional()
  @ValidateIf((_, v) => v != null && v !== '')
  @IsString()
  @MaxLength(10)
  @Matches(/^\d{1,10}$/, { message: 'Código IBGE deve conter apenas dígitos' })
  codIbgeCidade?: string;
}
