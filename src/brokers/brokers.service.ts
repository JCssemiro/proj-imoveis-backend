import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse } from '../common/dto/paginated-response.dto';

@Injectable()
export class BrokersService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: { pagina?: number | string; tamanho?: number | string }) {
    const { page, size, skip } = getPaginationParams(pagination);
    const where = { tipo: 'broker' as const };
    const [total, brokers] = await Promise.all([
      this.prisma.usuario.count({ where }),
      this.prisma.usuario.findMany({
        where,
        orderBy: { nome: 'asc' },
        include: {
          _count: { select: { conversationsAsBroker: true } },
        },
        skip,
        take: size,
      }),
    ]);
    const conteudo = brokers.map((b) => ({
      id: b.id,
      name: b.nome,
      email: b.email,
      phone: b.telefone,
      creci: b.creci ?? '',
      avatar: b.avatar,
      specialties: [] as string[],
      rating: 0,
      totalConversas: b._count.conversationsAsBroker,
    }));
    return buildPaginatedResponse(page, size, total, conteudo);
  }
}
