import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse, PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { decimalToNumber } from '../common/utils/decimal';

export interface ParametroItem {
  codigo: number;
  nome: string;
}

export interface TipoImovelParametro extends ParametroItem {
  finalidadeUsoCodigo: number;
}

export interface PlanoParametro extends ParametroItem {
  precoMensal: number;
}

@Injectable()
export class ParametrosService {
  constructor(private prisma: PrismaService) {}

  private async paginateParam(
    model: 'finalidadeuso' | 'finalidadecontratacao' | 'mobilia' | 'urgencia',
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const delegate = this.prisma[model] as unknown as {
      count: (args: object) => Promise<number>;
      findMany: (args: object) => Promise<ParametroItem[]>;
    };
    const [total, rows] = await Promise.all([
      delegate.count({ where }),
      delegate.findMany({
        where,
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getFinalidadeUsoPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<ParametroItem>> {
    return this.paginateParam('finalidadeuso', pagination);
  }

  async getFinalidadeContratacaoPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<ParametroItem>> {
    return this.paginateParam('finalidadecontratacao', pagination);
  }

  async getTiposImovelPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<TipoImovelParametro>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.tipoimovel.count({ where }),
      this.prisma.tipoimovel.findMany({
        where,
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true, finalidadeusocodigo: true },
        skip,
        take: size,
      }),
    ]);
    const conteudo: TipoImovelParametro[] = rows.map((r) => ({
      codigo: r.codigo,
      nome: r.nome,
      finalidadeUsoCodigo: r.finalidadeusocodigo,
    }));
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async getMobiliasPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<ParametroItem>> {
    return this.paginateParam('mobilia', pagination);
  }

  async getUrgenciaPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<ParametroItem>> {
    return this.paginateParam('urgencia', pagination);
  }

  async getPlanosPaginado(
    pagination: { pagina?: number | string; tamanho?: number | string },
  ): Promise<PaginatedResponseDto<PlanoParametro>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.plano.count({ where }),
      this.prisma.plano.findMany({
        where,
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true, precomensal: true },
        skip,
        take: size,
      }),
    ]);
    const conteudo: PlanoParametro[] = rows.map((r) => ({
      codigo: r.codigo,
      nome: r.nome,
      precoMensal: decimalToNumber(r.precomensal),
    }));
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async getAll(): Promise<{
    finalidadeuso: ParametroItem[];
    finalidadecontratacao: ParametroItem[];
    tipoimovel: TipoImovelParametro[];
    mobilia: ParametroItem[];
    urgencia: ParametroItem[];
    plano: PlanoParametro[];
  }> {
    const [finalidadeuso, finalidadecontratacao, tipoimovel, mobilia, urgencia, planos] = await Promise.all([
      this.prisma.finalidadeuso.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true },
      }),
      this.prisma.finalidadecontratacao.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true },
      }),
      this.prisma.tipoimovel.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true, finalidadeusocodigo: true },
      }),
      this.prisma.mobilia.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true },
      }),
      this.prisma.urgencia.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true },
      }),
      this.prisma.plano.findMany({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
        select: { codigo: true, nome: true, precomensal: true },
      }),
    ]);

    return {
      finalidadeuso,
      finalidadecontratacao,
      tipoimovel: tipoimovel.map((r) => ({
        codigo: r.codigo,
        nome: r.nome,
        finalidadeUsoCodigo: r.finalidadeusocodigo,
      })),
      mobilia,
      urgencia,
      plano: planos.map((p) => ({
        codigo: p.codigo,
        nome: p.nome,
        precoMensal: decimalToNumber(p.precomensal),
      })),
    };
  }
}
