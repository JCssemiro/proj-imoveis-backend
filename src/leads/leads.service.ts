import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { statuslead } from '@prisma/client';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse } from '../common/dto/paginated-response.dto';

const interestInclude = {
  client: true,
  finalidade: true,
  tipoimovel: true,
  tipocasa: true,
  mobilia: true,
  localizacoes: true,
  features: { include: { feature: true } },
} as const;

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  private toPropertyInterest(
    row: {
      id: string;
      clientid: string;
      client: { nome: string; telefone: string; email: string };
      compraoualuguel: string;
      finalidade: { codigo: string; label?: string };
      tipoimovel: { codigo: string; label?: string };
      tipocasa: { codigo: string; label?: string };
      mobilia: { codigo: string; label?: string };
      localizacoes: Array<{ cep: string | null; municipiocodibge: string | null; bairro: string | null }>;
      features: Array<{ feature: { codigo: string; label?: string } }>;
      quartos: number | null;
      suites: number | null;
      metragemterreno: number | null;
      areaconstruida: number | null;
      minprice: number;
      maxprice: number;
      observacoes: string;
      criadoem: Date;
      ativo: boolean;
    },
  ) {
    const label = (r: { codigo: string; label?: string }) => r?.label ?? r?.codigo ?? '';
    const num = (n: number | null) => (n != null ? String(n) : '');
    const localizacoesResposta = row.localizacoes.map((loc) => loc.bairro || loc.cep || loc.municipiocodibge || '').filter(Boolean);
    const featuresResposta = row.features.map((f) => f.feature.label ?? f.feature.codigo);
    return {
      id: row.id,
      clientId: row.clientid,
      clientName: row.client.nome,
      clientPhone: row.client.telefone,
      clientEmail: row.client.email,
      locations: localizacoesResposta,
      compraOuAluguel: row.compraoualuguel,
      finalidade: label(row.finalidade),
      tipoImovel: label(row.tipoimovel),
      tipoCasa: label(row.tipocasa),
      quartos: num(row.quartos),
      suites: num(row.suites),
      metragemTerreno: num(row.metragemterreno),
      areaConstruida: num(row.areaconstruida),
      mobilia: label(row.mobilia),
      minPrice: row.minprice,
      maxPrice: row.maxprice,
      features: featuresResposta,
      notes: row.observacoes,
      createdAt: row.criadoem.toISOString(),
      isActive: row.ativo,
    };
  }

  async findAll(
    brokerId: string,
    filters: {
      status?: string;
      tipoImovelId?: string;
      finalidadeId?: string;
      tipoCasaId?: string;
      mobiliaId?: string;
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
    const interesseWhere: Record<string, unknown> = {};
    if (filters.tipoImovelId) interesseWhere.tipoimovelid = filters.tipoImovelId;
    if (filters.finalidadeId) interesseWhere.finalidadeid = filters.finalidadeId;
    if (filters.tipoCasaId) interesseWhere.tipocasaid = filters.tipoCasaId;
    if (filters.mobiliaId) interesseWhere.mobiliaid = filters.mobiliaId;
    if (filters.compraOuAluguel === 'compra' || filters.compraOuAluguel === 'aluguel') {
      interesseWhere.compraoualuguel = filters.compraOuAluguel;
    }
    if (filters.regiao) {
      interesseWhere.localizacoes = {
        some: {
          OR: [
            { cep: filters.regiao },
            { bairro: filters.regiao },
            { municipiocodibge: filters.regiao },
          ],
        },
      };
    }
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
      interesseWhere.minprice = { gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
      interesseWhere.maxprice = { lte: filters.maxPrice };
    }
    const prospectoWhere: Record<string, unknown> = {
      ...(filters.status && { status: filters.status as statuslead }),
      ...(Object.keys(interesseWhere).length > 0 && { interesse: interesseWhere }),
    };
    if (filters.dataInicio || filters.dataFim) {
      prospectoWhere.criadoem = {};
      if (filters.dataInicio) (prospectoWhere.criadoem as Record<string, Date>).gte = new Date(filters.dataInicio);
      if (filters.dataFim) (prospectoWhere.criadoem as Record<string, Date>).lte = new Date(filters.dataFim);
    }
    const [total, leads] = await Promise.all([
      this.prisma.prospecto.count({ where: prospectoWhere }),
      this.prisma.prospecto.findMany({
        where: prospectoWhere,
        orderBy: { criadoem: 'desc' },
        include: {
          interesse: { include: interestInclude },
          corretor: true,
        },
        skip,
        take: size,
      }),
    ]);
    const conteudo = leads.map((l) => ({
      id: l.id,
      interest: this.toPropertyInterest(l.interesse),
      brokerId: l.corretorid,
      status: l.status,
      createdAt: l.criadoem.toISOString(),
    }));
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async findOne(id: string) {
    const lead = await this.prisma.prospecto.findUnique({
      where: { id },
      include: {
        interesse: { include: interestInclude },
        corretor: true,
      },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    return {
      id: lead.id,
      interest: this.toPropertyInterest(lead.interesse),
      brokerId: lead.corretorid,
      status: lead.status,
      createdAt: lead.criadoem.toISOString(),
    };
  }

  async update(id: string, dto: UpdateLeadDto, currentBrokerId: string) {
    const lead = await this.prisma.prospecto.findUnique({
      where: { id },
      include: {
        interesse: { include: interestInclude },
        corretor: true,
      },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    if (dto.brokerId !== undefined && dto.brokerId !== null && dto.brokerId !== currentBrokerId) {
      throw new ForbiddenException('O corretor só pode atribuir o lead a si mesmo');
    }
    const updated = await this.prisma.prospecto.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status as statuslead }),
        ...(dto.brokerId !== undefined && { corretorid: dto.brokerId }),
      },
      include: {
        interesse: { include: interestInclude },
        corretor: true,
      },
    });
    return {
      id: updated.id,
      interest: this.toPropertyInterest(updated.interesse),
      brokerId: updated.corretorid,
      status: updated.status,
      createdAt: updated.criadoem.toISOString(),
    };
  }
}
