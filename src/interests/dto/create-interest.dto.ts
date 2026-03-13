import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';

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

export class CreateInterestDto {
  @ApiProperty({ description: 'Regiões de interesse', example: ['Centro', 'Zona Sul'] })
  @IsArray()
  @IsString({ each: true })
  localizacoes: string[];

  @ApiProperty({ enum: compraOuAluguel })
  @IsIn(compraOuAluguel)
  compraOuAluguel: string;

  @ApiProperty({ enum: finalidade })
  @IsIn(finalidade)
  finalidade: string;

  @ApiProperty({ enum: tipoImovel })
  @IsIn(tipoImovel)
  tipoImovel: string;

  @ApiPropertyOptional({ enum: tipoCasa })
  @IsOptional()
  @IsIn(tipoCasa)
  tipoCasa?: string;

  @ApiPropertyOptional({ enum: quartos })
  @IsOptional()
  @IsIn(quartos)
  quartos?: string;

  @ApiPropertyOptional({ enum: suites })
  @IsOptional()
  @IsIn(suites)
  suites?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banheiros?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  garagens?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metragemTerreno?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaConstruida?: string;

  @ApiPropertyOptional({ enum: mobilia })
  @IsOptional()
  @IsIn(mobilia)
  mobilia?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMinimo?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMaximo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  caracteristicas?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;
}
