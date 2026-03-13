import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.toUserResponse(user);
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (dto.email !== undefined && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException('E-mail já está em uso por outra conta');
      }
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.cpf !== undefined && user.type === 'client' && { cpf: dto.cpf }),
        ...(dto.creci !== undefined && user.type === 'broker' && { creci: dto.creci }),
      },
    });
    return this.toUserResponse(updated);
  }

  private toUserResponse(user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string | null;
    type: string;
    avatar: string | null;
    creci: string | null;
    subscriptionActive: boolean | null;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      cpf: user.cpf,
      type: user.type,
      avatar: user.avatar,
      creci: user.creci,
      subscriptionActive: user.subscriptionActive,
    };
  }
}
