import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrokersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const brokers = await this.prisma.usuario.findMany({
      where: { type: 'broker' },
      include: {
        _count: { select: { leadsAsBroker: true } },
      },
    });
    return brokers.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      phone: b.phone,
      creci: b.creci ?? '',
      avatar: b.avatar,
      specialties: [] as string[], // Pode ser expandido com tabela de especialidades
      rating: 0,
      totalLeads: b._count.leadsAsBroker,
    }));
  }
}
