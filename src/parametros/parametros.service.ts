import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse, PaginatedResponseDto } from '../common/dto/paginated-response.dto';

export interface ParametroItem {
  id: string;
  codigo: string;
  label: string;
  ordem: number;
}

@Injectable()
export class ParametrosService {
  constructor(private prisma: PrismaService) {}

  async getFinalidades(): Promise<ParametroItem[]> {
    const rows = await this.prisma.finalidade.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getFinalidadesPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.finalidade.count({ where }),
      this.prisma.finalidade.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getTiposImovel(): Promise<ParametroItem[]> {
    const rows = await this.prisma.tipoimovel.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getTiposImovelPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.tipoimovel.count({ where }),
      this.prisma.tipoimovel.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getTiposCasa(): Promise<ParametroItem[]> {
    const rows = await this.prisma.tipocasa.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getTiposCasaPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.tipocasa.count({ where }),
      this.prisma.tipocasa.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getMobilias(): Promise<ParametroItem[]> {
    const rows = await this.prisma.mobilia.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getMobiliasPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.mobilia.count({ where }),
      this.prisma.mobilia.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getFeatures(): Promise<ParametroItem[]> {
    const rows = await this.prisma.feature.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getFeaturesPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.feature.count({ where }),
      this.prisma.feature.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  async getPlanos(): Promise<ParametroItem[]> {
    const rows = await this.prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { ordem: 'asc' },
      select: { id: true, codigo: true, label: true, ordem: true },
    });
    return rows;
  }

  async getPlanosPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<ParametroItem>> {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { ativo: true } as const;
    const [total, rows] = await Promise.all([
      this.prisma.plano.count({ where }),
      this.prisma.plano.findMany({
        where,
        orderBy: { ordem: 'asc' },
        select: { id: true, codigo: true, label: true, ordem: true },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, rows);
  }

  getCompraOuAluguel(): { valor: string; label: string; ordem: number }[] {
    return [
      { valor: 'compra', label: 'Compra', ordem: 1 },
      { valor: 'aluguel', label: 'Aluguel', ordem: 2 },
    ];
  }

  async getCompraOuAluguelPaginado(pagination: { pagina?: number | string; tamanho?: number | string }): Promise<PaginatedResponseDto<{ valor: string; label: string; ordem: number }>> {
    const { page, size } = getPaginationParams(pagination);
    const itens = this.getCompraOuAluguel();
    const total = itens.length;
    const start = (page - 1) * size;
    const end = start + size;
    const conteudo = itens.slice(start, end);
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async getAll(): Promise<{
    finalidade: ParametroItem[];
    tipoimovel: ParametroItem[];
    tipocasa: ParametroItem[];
    mobilia: ParametroItem[];
    feature: ParametroItem[];
    plano: ParametroItem[];
    compraoualuguel: { valor: string; label: string; ordem: number }[];
  }> {
    const [finalidade, tipoimovel, tipocasa, mobilia, feature, plano] = await Promise.all([
      this.getFinalidades(),
      this.getTiposImovel(),
      this.getTiposCasa(),
      this.getMobilias(),
      this.getFeatures(),
      this.getPlanos(),
    ]);
    return {
      finalidade,
      tipoimovel,
      tipocasa,
      mobilia,
      feature,
      plano,
      compraoualuguel: this.getCompraOuAluguel(),
    };
  }
}
