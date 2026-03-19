import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

const PADRAO_TAMANHO = 20;
const PADRAO_PAGINA = 1;
const MAX_TAMANHO = 100;

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número da página (1-based). Padrão: 1',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = PADRAO_PAGINA;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página. Padrão: 20',
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_TAMANHO)
  tamanho?: number = PADRAO_TAMANHO;
}

export type PaginationParams = { page: number; size: number; skip: number };

export function getPaginationParams(query: {
  pagina?: number | string;
  tamanho?: number | string;
}): PaginationParams {
  const paginaRaw = query.pagina;
  const tamanhoRaw = query.tamanho;
  const pagina =
    paginaRaw !== undefined && paginaRaw !== '' ? Math.max(1, Number(paginaRaw) || PADRAO_PAGINA) : PADRAO_PAGINA;
  const tamanho =
    tamanhoRaw !== undefined && tamanhoRaw !== ''
      ? Math.min(MAX_TAMANHO, Math.max(1, Number(tamanhoRaw) || PADRAO_TAMANHO))
      : PADRAO_TAMANHO;
  const skip = (pagina - 1) * tamanho;
  return { page: pagina, size: tamanho, skip };
}
