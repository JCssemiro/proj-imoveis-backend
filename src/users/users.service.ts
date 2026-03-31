import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
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
    });
    return this.toUserResponse(updated);
  }

  async changeBrokerPlan(brokerId: string, planoId: string) {
    const user = await this.prisma.usuario.findUnique({ where: { id: brokerId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.tipo !== 'broker') throw new ForbiddenException('Apenas corretores podem alterar o plano');

    const plan = await this.prisma.plano.findFirst({
      where: { id: planoId, ativo: true },
    });
    if (!plan) {
      throw new BadRequestException('planoId inválido ou inativo. Use um ID retornado por GET /parametros/plano.');
    }

    const updated = await this.prisma.usuario.update({
      where: { id: brokerId },
      data: {
        planoid: planoId,
        ativoassinatura: true,
      },
    });
    return this.toUserResponse(updated);
  }

  private toUserResponse(user: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: string;
    avatar: string | null;
    creci: string | null;
    ativoassinatura: boolean | null;
  }) {
    return {
      id: user.id,
      name: user.nome,
      email: user.email,
      phone: user.telefone,
      type: user.tipo,
      avatar: user.avatar,
      creci: user.creci,
      subscriptionActive: user.ativoassinatura,
    };
  }
}
