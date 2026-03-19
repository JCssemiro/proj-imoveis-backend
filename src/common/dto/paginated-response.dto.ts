import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Página atual (1-based)' })
  paginaAtual: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPaginas: number;

  @ApiProperty({ description: 'Quantidade total de elementos (todas as páginas)' })
  qtdElementos: number;

  @ApiProperty({ description: 'Itens da página atual', isArray: true })
  conteudo: T[];

  constructor(paginaAtual: number, totalPaginas: number, qtdElementos: number, conteudo: T[]) {
    this.paginaAtual = paginaAtual;
    this.totalPaginas = totalPaginas;
    this.qtdElementos = qtdElementos;
    this.conteudo = conteudo;
  }
}

export function buildPaginatedResponse<T>(
  page: number,
  size: number,
  total: number,
  conteudo: T[],
): PaginatedResponseDto<T> {
  const totalPaginas = size > 0 ? Math.ceil(total / size) : 0;
  return new PaginatedResponseDto(page, totalPaginas, total, conteudo);
}
