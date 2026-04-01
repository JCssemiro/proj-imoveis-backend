import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Prisma } from '@prisma/client';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse } from '../common/dto/paginated-response.dto';
import { STATUS_LEAD, isClosedStatus } from '../common/constants/status-lead';
import { decimalToNumber } from '../common/utils/decimal';

const interestInclude = {
  client: true,
  finalidadecontratacao: true,
  finalidadeuso: true,
  tipoimovel: true,
  mobilia: true,
  urgencia: true,
  localizacoes: true,
} as const satisfies Prisma.interesseimovelInclude;

type InterestLeadRow = Prisma.interesseimovelGetPayload<{ include: typeof interestInclude }>;

function optInt(v?: string): number | undefined {
  if (v === undefined || v === '') return undefined;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  private toInterestCard(row: InterestLeadRow) {
    const locs = (row.localizacoes ?? [])
      .map(
        (loc: { bairro: string | null; cidade: string | null; cep: string | null }) =>
          loc.bairro || loc.cidade || loc.cep || '',
      )
      .filter(Boolean);
    return {
      id: row.id,
      clientId: row.clientid,
      clientName: row.client.nome,
      clientPhone: row.client.telefone,
      clientEmail: row.client.email,
      locations: locs,
      finalidadeContratacao: row.finalidadecontratacao.nome,
      finalidadeUso: row.finalidadeuso.nome,
      tipoImovel: row.tipoimovel.nome,
      mobilia: row.mobilia.nome,
      urgencia: row.urgencia.nome,
      aceitaFinanciamento: row.aceitafinanciamento,
      quartos: row.quartos ?? [],
      suites: row.suites ?? [],
      metragem: row.metragem,
      minPrice: decimalToNumber(row.minprice),
      maxPrice: decimalToNumber(row.maxprice),
      notes: row.observacoes,
      status: row.status,
      createdAt: row.criadoem.toISOString(),
      isActive: row.ativo,
    };
  }

  async findAll(
    _brokerId: string,
    filters: {
      status?: string;
      tipoImovelCodigo?: string;
      finalidadeContratacaoCodigo?: string;
      finalidadeUsoCodigo?: string;
      mobiliaCodigo?: string;
      compraOuAluguel?: string;
      regiao?: string;
      minPrice?: number;
      maxPrice?: number;
      dataInicio?: string;
      dataFim?: string;
    },
    pagination: { pagina?: number | string; tamanho?: number | string },
  ) {
    const { page, size, skip } = getPaginationParams(pagination);
    const statusFilter = optInt(filters.status);
    const where: Prisma.interesseimovelWhereInput = {
      ativo: true,
      ...(statusFilter !== undefined
        ? { status: statusFilter }
        : { status: { not: STATUS_LEAD.CLOSED } }),
    };

    const tipoCodigo = optInt(filters.tipoImovelCodigo);
    if (tipoCodigo !== undefined) where.tipoimovelcodigo = tipoCodigo;
    const fcCodigo = optInt(filters.finalidadeContratacaoCodigo);
    if (fcCodigo !== undefined) {
      where.finalidadecontratacaocodigo = fcCodigo;
    } else if (filters.compraOuAluguel === 'compra') {
      where.finalidadecontratacaocodigo = 1;
    } else if (filters.compraOuAluguel === 'aluguel') {
      where.finalidadecontratacaocodigo = 2;
    }
    const fuCodigo = optInt(filters.finalidadeUsoCodigo);
    if (fuCodigo !== undefined) where.finalidadeusocodigo = fuCodigo;
    const mobCodigo = optInt(filters.mobiliaCodigo);
    if (mobCodigo !== undefined) where.mobiliacodigo = mobCodigo;

    if (filters.regiao) {
      where.localizacoes = {
        some: {
          OR: [
            { cep: { contains: filters.regiao } },
            { bairro: { contains: filters.regiao, mode: 'insensitive' } },
            { cidade: { contains: filters.regiao, mode: 'insensitive' } },
            { codibgecidade: filters.regiao },
          ],
        },
      };
    }
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      where.minprice = { gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      where.maxprice = { lte: filters.maxPrice };
    }
    if (filters.dataInicio || filters.dataFim) {
      where.criadoem = {};
      if (filters.dataInicio) (where.criadoem as { gte?: Date }).gte = new Date(filters.dataInicio);
      if (filters.dataFim) (where.criadoem as { lte?: Date }).lte = new Date(filters.dataFim);
    }

    const [total, rows] = await Promise.all([
      this.prisma.interesseimovel.count({ where }),
      this.prisma.interesseimovel.findMany({
        where,
        orderBy: { criadoem: 'desc' },
        include: interestInclude,
        skip,
        take: size,
      }),
    ]);

    const conteudo = rows.map((r) => ({
      id: r.id,
      interest: this.toInterestCard(r),
      createdAt: r.criadoem.toISOString(),
    }));
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async findOne(id: string, _brokerId: string) {
    const row = await this.prisma.interesseimovel.findUnique({
      where: { id },
      include: interestInclude,
    });
    if (!row) throw new NotFoundException('Lead não encontrado');
    if (isClosedStatus(row.status) || !row.ativo) {
      throw new NotFoundException('Lead não encontrado');
    }
    return {
      id: row.id,
      interest: this.toInterestCard(row),
      createdAt: row.criadoem.toISOString(),
    };
  }

  async update(id: string, dto: UpdateLeadDto, _currentBrokerId: string) {
    const row = await this.prisma.interesseimovel.findUnique({
      where: { id },
      include: interestInclude,
    });
    if (!row) throw new NotFoundException('Lead não encontrado');

    const updated = await this.prisma.interesseimovel.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
      },
      include: interestInclude,
    });

    return {
      id: updated.id,
      interest: this.toInterestCard(updated),
      createdAt: updated.criadoem.toISOString(),
    };
  }
}
