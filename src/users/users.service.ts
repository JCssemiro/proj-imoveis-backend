import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber } from '../common/utils/decimal';

export type UserPlanPayload = {
  codigo: number;
  nome: string;
  precoMensal: number;
} | null;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { plano: true },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.toUserResponse(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (dto.email !== undefined && dto.email !== user.email) {
      const existing = await this.prisma.usuario.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('E-mail já está em uso por outra conta');
      }
    }

    if (dto.creci !== undefined && user.tipo === 'broker') {
      const existingCreci = await this.prisma.usuario.findFirst({
        where: { creci: dto.creci, id: { not: userId } },
      });
      if (existingCreci) {
        throw new ConflictException('CRECI já está em uso por outra conta');
      }
    }

    const updated = await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { nome: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { telefone: dto.phone }),
        ...(dto.creci !== undefined && user.tipo === 'broker' && { creci: dto.creci }),
      },
      include: { plano: true },
    });
    return this.toUserResponse(updated);
  }

  async changeBrokerPlan(brokerId: string, planoCodigo: number) {
    const user = await this.prisma.usuario.findUnique({ where: { id: brokerId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.tipo !== 'broker') throw new ForbiddenException('Apenas corretores podem alterar o plano');

    const plan = await this.prisma.plano.findFirst({
      where: { codigo: planoCodigo, ativo: true },
    });
    if (!plan) {
      throw new BadRequestException(
        'planoCodigo inválido ou inativo. Use um código retornado por GET /parametros/plano.',
      );
    }

    const updated = await this.prisma.usuario.update({
      where: { id: brokerId },
      data: {
        planocodigo: planoCodigo,
        ativoassinatura: true,
      },
      include: { plano: true },
    });
    return this.toUserResponse(updated);
  }

  private planFromRow(p: { codigo: number; nome: string; precomensal: Decimal } | null): UserPlanPayload {
    if (!p) return null;
    return {
      codigo: p.codigo,
      nome: p.nome,
      precoMensal: decimalToNumber(p.precomensal),
    };
  }

  private toUserResponse(
    user: {
      id: string;
      nome: string;
      email: string;
      telefone: string;
      tipo: string;
      avatar: string | null;
      creci: string | null;
      ativoassinatura: boolean | null;
      plano: { codigo: number; nome: string; precomensal: Decimal } | null;
    },
  ) {
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      phone: user.telefone,
      type: user.tipo,
      avatar: user.avatar,
      creci: user.creci,
      subscriptionActive: user.ativoassinatura,
      plan: this.planFromRow(user.plano),
    };
  }
}
