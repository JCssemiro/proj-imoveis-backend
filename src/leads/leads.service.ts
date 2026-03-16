import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@prisma/client';

const interestInclude = {
  client: true,
  compraOuAluguel: true,
  finalidade: true,
  tipoImovel: true,
  tipoCasa: true,
  mobilia: true,
} as const;

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  private toPropertyInterest(
    row: {
      id: string;
      clientId: string;
      client: { name: string; phone: string; email: string };
      locations: string[];
      compraOuAluguel: { codigo: string; label?: string };
      finalidade: { codigo: string; label?: string };
      tipoImovel: { codigo: string; label?: string };
      tipoCasa: { codigo: string; label?: string };
      mobilia: { codigo: string; label?: string };
      quartos: number | null;
      suites: number | null;
      metragemTerreno: number | null;
      areaConstruida: number | null;
      minPrice: number;
      maxPrice: number;
      features: string[];
      notes: string;
      createdAt: Date;
      isActive: boolean;
    },
  ) {
    const label = (r: { codigo: string; label?: string }) => r?.label ?? r?.codigo ?? '';
    const num = (n: number | null) => (n != null ? String(n) : '');
    return {
      id: row.id,
      clientId: row.clientId,
      clientName: row.client.name,
      clientPhone: row.client.phone,
      clientEmail: row.client.email,
      locations: row.locations,
      compraOuAluguel: label(row.compraOuAluguel),
      finalidade: label(row.finalidade),
      tipoImovel: label(row.tipoImovel),
      tipoCasa: label(row.tipoCasa),
      quartos: num(row.quartos),
      suites: num(row.suites),
      metragemTerreno: num(row.metragemTerreno),
      areaConstruida: num(row.areaConstruida),
      mobilia: label(row.mobilia),
      minPrice: row.minPrice,
      maxPrice: row.maxPrice,
      features: row.features,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
      isActive: row.isActive,
    };
  }

  async findAll(brokerId: string, filters: { status?: string; tipoImovel?: string; regiao?: string; maxPrice?: number }) {
    const leads = await this.prisma.prospecto.findMany({
      where: {
        ...(filters.status && { status: filters.status as LeadStatus }),
        interest: {
          ...(filters.tipoImovel && { tipoImovel: { codigo: filters.tipoImovel } }),
          ...(filters.regiao && { locations: { has: filters.regiao } }),
          ...(filters.maxPrice !== undefined && filters.maxPrice !== null && {
            maxPrice: { lte: filters.maxPrice },
          }),
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        interest: { include: interestInclude },
        broker: true,
      },
    });
    return leads.map((l) => ({
      id: l.id,
      interest: this.toPropertyInterest(l.interest),
      brokerId: l.brokerId,
      status: l.status,
      createdAt: l.createdAt.toISOString(),
    }));
  }

  async findOne(id: string) {
    const lead = await this.prisma.prospecto.findUnique({
      where: { id },
      include: {
        interest: { include: interestInclude },
        broker: true,
      },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    return {
      id: lead.id,
      interest: this.toPropertyInterest(lead.interest),
      brokerId: lead.brokerId,
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
    };
  }

  async update(id: string, dto: UpdateLeadDto, currentBrokerId: string) {
    const lead = await this.prisma.prospecto.findUnique({
      where: { id },
      include: {
        interest: { include: interestInclude },
        broker: true,
      },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    if (dto.brokerId !== undefined && dto.brokerId !== null && dto.brokerId !== currentBrokerId) {
      throw new ForbiddenException('O corretor só pode atribuir o lead a si mesmo');
    }
    const updated = await this.prisma.prospecto.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status as LeadStatus }),
        ...(dto.brokerId !== undefined && { brokerId: dto.brokerId }),
      },
      include: {
        interest: { include: interestInclude },
        broker: true,
      },
    });
    return {
      id: updated.id,
      interest: this.toPropertyInterest(updated.interest),
      brokerId: updated.brokerId,
      status: updated.status,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
