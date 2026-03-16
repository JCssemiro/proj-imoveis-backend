import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { LeadStatus } from '@prisma/client';

const includeRelations = {
  client: true,
  compraOuAluguel: true,
  finalidade: true,
  tipoImovel: true,
  tipoCasa: true,
  mobilia: true,
} as const;

function parseOptionalInt(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;
  const s = String(value).trim();
  if (s === '') return null;
  const n = parseInt(s.replace(/\+$/, ''), 10); // "6+" -> 6
  return isNaN(n) ? null : n;
}

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(clientId: string, isActive?: boolean) {
    const list = await this.prisma.interesseimovel.findMany({
      where: {
        clientId,
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: { createdAt: 'desc' },
      include: includeRelations,
    });
    return list.map((i) => this.toPropertyInterest(i));
  }

  async findOne(id: string, clientId: string) {
    const interest = await this.prisma.interesseimovel.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!interest || interest.clientId !== clientId) {
      throw new NotFoundException('Interesse não encontrado');
    }
    return this.toPropertyInterest(interest);
  }

  async create(clientId: string, dto: CreateInterestDto) {
    const client = await this.prisma.usuario.findUnique({
      where: { id: clientId },
    });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    const minP = dto.valorMinimo ?? 0;
    const maxP = dto.valorMaximo ?? 0;
    if (minP > maxP) {
      throw new BadRequestException('valorMinimo não pode ser maior que valorMaximo');
    }

    const [compra, finalidade, tipoImovel, tipoCasa, mobilia] = await Promise.all([
      this.prisma.compraoualuguel.findUnique({ where: { codigo: dto.compraOuAluguel } }),
      this.prisma.finalidade.findUnique({ where: { codigo: dto.finalidade } }),
      this.prisma.tipoimovel.findUnique({ where: { codigo: dto.tipoImovel } }),
      this.prisma.tipocasa.findFirst({ where: { codigo: dto.tipoCasa ?? 'vazio' } }).then((r) => r ?? this.prisma.tipocasa.findFirst()),
      this.prisma.mobilia.findFirst({ where: { codigo: dto.mobilia ?? 'sem_mobilia' } }).then((r) => r ?? this.prisma.mobilia.findFirst()),
    ]);
    if (!compra || !finalidade || !tipoImovel || !tipoCasa || !mobilia) {
      throw new BadRequestException('Parâmetros de interesse não encontrados. Execute o seed do banco (finalidade, tipoimovel, compraoualuguel, tipocasa, mobilia).');
    }

    const created = await this.prisma.interesseimovel.create({
      data: {
        clientId,
        locations: dto.localizacoes ?? [],
        compraOuAluguelId: compra.id,
        finalidadeId: finalidade.id,
        tipoImovelId: tipoImovel.id,
        tipoCasaId: tipoCasa.id,
        mobiliaId: mobilia.id,
        quartos: parseOptionalInt(dto.quartos),
        suites: parseOptionalInt(dto.suites),
        metragemTerreno: parseOptionalInt(dto.metragemTerreno),
        areaConstruida: parseOptionalInt(dto.areaConstruida),
        minPrice: dto.valorMinimo ?? 0,
        maxPrice: dto.valorMaximo ?? 0,
        features: dto.caracteristicas ?? [],
        notes: dto.observacoes ?? '',
      },
    });

    await this.prisma.prospecto.create({
      data: { interestId: created.id, status: LeadStatus.new },
    });

    const interest = await this.prisma.interesseimovel.findUnique({
      where: { id: created.id },
      include: includeRelations,
    });
    if (!interest) throw new NotFoundException('Interesse não encontrado após criação');
    return this.toPropertyInterest(interest);
  }

  async update(id: string, clientId: string, dto: UpdateInterestDto) {
    const interest = await this.prisma.interesseimovel.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!interest || interest.clientId !== clientId) {
      throw new NotFoundException('Interesse não encontrado');
    }

    const minP = dto.valorMinimo ?? interest.minPrice;
    const maxP = dto.valorMaximo ?? interest.maxPrice;
    if (minP > maxP) {
      throw new BadRequestException('valorMinimo não pode ser maior que valorMaximo');
    }

    const data: {
      locations?: string[];
      compraOuAluguelId?: string;
      finalidadeId?: string;
      tipoImovelId?: string;
      tipoCasaId?: string;
      mobiliaId?: string;
      quartos?: number | null;
      suites?: number | null;
      metragemTerreno?: number | null;
      areaConstruida?: number | null;
      minPrice?: number;
      maxPrice?: number;
      features?: string[];
      notes?: string;
    } = {
      ...(dto.localizacoes !== undefined && { locations: dto.localizacoes }),
      ...(dto.quartos !== undefined && { quartos: parseOptionalInt(dto.quartos) }),
      ...(dto.suites !== undefined && { suites: parseOptionalInt(dto.suites) }),
      ...(dto.metragemTerreno !== undefined && {
        metragemTerreno: parseOptionalInt(dto.metragemTerreno),
      }),
      ...(dto.areaConstruida !== undefined && {
        areaConstruida: parseOptionalInt(dto.areaConstruida),
      }),
      ...(dto.valorMinimo !== undefined && { minPrice: dto.valorMinimo }),
      ...(dto.valorMaximo !== undefined && { maxPrice: dto.valorMaximo }),
      ...(dto.caracteristicas !== undefined && { features: dto.caracteristicas }),
      ...(dto.observacoes !== undefined && { notes: dto.observacoes }),
    };

    if (dto.compraOuAluguel !== undefined) {
      const rec = await this.prisma.compraoualuguel.findUnique({ where: { codigo: dto.compraOuAluguel } });
      if (!rec) throw new BadRequestException('compraOuAluguel inválido');
      data.compraOuAluguelId = rec.id;
    }
    if (dto.finalidade !== undefined) {
      const rec = await this.prisma.finalidade.findUnique({ where: { codigo: dto.finalidade } });
      if (!rec) throw new BadRequestException('finalidade inválida');
      data.finalidadeId = rec.id;
    }
    if (dto.tipoImovel !== undefined) {
      const rec = await this.prisma.tipoimovel.findUnique({ where: { codigo: dto.tipoImovel } });
      if (!rec) throw new BadRequestException('tipoImovel inválido');
      data.tipoImovelId = rec.id;
    }
    if (dto.tipoCasa !== undefined) {
      const rec = await this.prisma.tipocasa.findFirst({ where: { codigo: dto.tipoCasa ?? 'vazio' } }).then((r) => r ?? this.prisma.tipocasa.findFirst());
      if (!rec) throw new BadRequestException('tipoCasa inválido');
      data.tipoCasaId = rec.id;
    }
    if (dto.mobilia !== undefined) {
      const rec = await this.prisma.mobilia.findFirst({ where: { codigo: dto.mobilia ?? 'sem_mobilia' } }).then((r) => r ?? this.prisma.mobilia.findFirst());
      if (!rec) throw new BadRequestException('mobilia inválida');
      data.mobiliaId = rec.id;
    }

    const updated = await this.prisma.interesseimovel.update({
      where: { id },
      data,
      include: includeRelations,
    });
    return this.toPropertyInterest(updated);
  }

  async remove(id: string, clientId: string) {
    const interest = await this.prisma.interesseimovel.findUnique({
      where: { id },
    });
    if (!interest || interest.clientId !== clientId) {
      throw new NotFoundException('Interesse não encontrado');
    }
    await this.prisma.interesseimovel.update({
      where: { id },
      data: { isActive: false },
    });
  }

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
    const code = (r: { codigo: string; label?: string }) => r?.codigo ?? '';
    const label = (r: { codigo: string; label?: string }) => r?.label ?? r?.codigo ?? '';
    const num = (n: number | null) => (n != null ? String(n) : '');
    return {
      id: row.id,
      clientId: row.clientId,
      clientName: row.client.name,
      clientPhone: row.client.phone,
      clientEmail: row.client.email,
      locations: row.locations,
      compraOuAluguel: label(row.compraOuAluguel) || code(row.compraOuAluguel),
      finalidade: label(row.finalidade) || code(row.finalidade),
      tipoImovel: label(row.tipoImovel) || code(row.tipoImovel),
      tipoCasa: label(row.tipoCasa) || code(row.tipoCasa),
      quartos: num(row.quartos),
      suites: num(row.suites),
      metragemTerreno: num(row.metragemTerreno),
      areaConstruida: num(row.areaConstruida),
      mobilia: label(row.mobilia) || code(row.mobilia),
      minPrice: row.minPrice,
      maxPrice: row.maxPrice,
      features: row.features,
      notes: row.notes,
      createdAt: row.createdAt.toISOString(),
      isActive: row.isActive,
    };
  }
}
