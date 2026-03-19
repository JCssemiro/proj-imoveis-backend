import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  MaxLength,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocalizacaoInteresseDto } from './localizacao-interesse.dto';

export class CreateInterestDto {
  @ApiPropertyOptional({
    description: 'Localizações de interesse (CEP, município cod IBGE, bairro)',
    type: [LocalizacaoInteresseDto],
    example: [{ cep: '01310100', bairro: 'Bela Vista' }, { municipiocodibge: '3550308' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizacaoInteresseDto)
  localizacoes?: LocalizacaoInteresseDto[];

  @ApiProperty({
    description: 'Compra ou aluguel. Valores: compra | aluguel (obter de GET /parametros/compraoualuguel)',
    enum: ['compra', 'aluguel'],
  })
  @IsIn(['compra', 'aluguel'])
  compraOuAluguel: 'compra' | 'aluguel';

  @ApiProperty({
    description: 'ID da finalidade (obter de GET /parametros/finalidade)',
    example: 'uuid',
  })
  @IsUUID('4')
  finalidadeId: string;

  @ApiProperty({
    description: 'ID do tipo de imóvel (obter de GET /parametros/tipoimovel)',
    example: 'uuid',
  })
  @IsUUID('4')
  tipoImovelId: string;

  @ApiPropertyOptional({
    description: 'ID do tipo de casa (obter de GET /parametros/tipocasa). Se omitido, usa o primeiro ativo por ordem.',
  })
  @IsOptional()
  @IsUUID('4')
  tipoCasaId?: string;

  @ApiPropertyOptional({ description: 'Quantidade de quartos (ex: 2, 6+)' })
  @IsOptional()
  @IsString()
  quartos?: string;

  @ApiPropertyOptional({ description: 'Quantidade de suítes (ex: 1, 4+)' })
  @IsOptional()
  @IsString()
  suites?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banheiros?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  garagens?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metragemTerreno?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaConstruida?: string;

  @ApiPropertyOptional({
    description: 'ID da mobília (obter de GET /parametros/mobilia). Se omitido, usa o primeiro ativo por ordem.',
  })
  @IsOptional()
  @IsUUID('4')
  mobiliaId?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMinimo?: number | null;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMaximo?: number | null;

  @ApiPropertyOptional({
    description: 'IDs das features (obter de GET /parametros/feature). Array de UUID.',
    type: [String],
    example: ['uuid1', 'uuid2'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  featureIds?: string[];

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Observações com no máximo 5000 caracteres' })
  observacoes?: string;
}
