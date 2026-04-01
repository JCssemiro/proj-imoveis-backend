import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocalizacaoInteresseDto } from './localizacao-interesse.dto';

const MAX_CODIGO = 2147483647;

export class CreateInterestDto {
  @ApiPropertyOptional({
    description: 'Localizações',
    type: [LocalizacaoInteresseDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocalizacaoInteresseDto)
  localizacoes?: LocalizacaoInteresseDto[];

  @ApiProperty({ description: 'Código em GET /parametros/finalidadecontratacao', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_CODIGO)
  finalidadeContratacaoCodigo: number;

  @ApiProperty({ description: 'Código em GET /parametros/finalidadeuso', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_CODIGO)
  finalidadeUsoCodigo: number;

  @ApiProperty({ description: 'Código em GET /parametros/tipoimovel (mesmo finalidadeUsoCodigo)', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_CODIGO)
  tipoImovelCodigo: number;

  @ApiProperty({ description: 'Código em GET /parametros/mobilia', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_CODIGO)
  mobiliaCodigo: number;

  @ApiProperty({ description: 'Código em GET /parametros/urgencia', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(MAX_CODIGO)
  urgenciaCodigo: number;

  @ApiProperty({ description: 'Aceita financiamento' })
  @IsBoolean()
  aceitaFinanciamento: boolean;

  @ApiPropertyOptional({
    description: 'Quantidades de quartos aceitas (ex.: [1,2] para 1 ou 2 quartos)',
    type: [Number],
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(50, { each: true })
  @ArrayMaxSize(30)
  quartos?: number[];

  @ApiPropertyOptional({
    description: 'Quantidades de suítes aceitas',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(50, { each: true })
  @ArrayMaxSize(30)
  suites?: number[];

  @ApiPropertyOptional({ description: 'Metragem (m²)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  metragem?: number | null;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valorMinimo?: number | null;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valorMaximo?: number | null;

  @ApiPropertyOptional({ maxLength: 5000 })
  @IsOptional()
  @IsString()
  @MaxLength(5000, { message: 'Observações com no máximo 5000 caracteres' })
  observacoes?: string;
}
