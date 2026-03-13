import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { SenderType } from '@prisma/client';
import { JwtPayload } from '../common/decorators/current-user.decorator';

function buildSummary(interest: {
  locations: string[];
  minPrice: number;
  maxPrice: number;
  compraOuAluguel: { codigo: string; label?: string };
  tipoImovel: { codigo: string; label?: string };
}): string {
  const loc = interest.locations?.length ? interest.locations.join(', ') : 'N/A';
  const compra = interest.compraOuAluguel?.label ?? interest.compraOuAluguel?.codigo ?? 'N/A';
  const tipo = interest.tipoImovel?.label ?? interest.tipoImovel?.codigo ?? 'N/A';
  return `${compra} - ${tipo} em ${loc} - R$ ${interest.minPrice} a R$ ${interest.maxPrice}`;
}

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, userType: 'client' | 'broker') {
    const where =
      userType === 'client'
        ? { clientId: userId }
        : { brokerId: userId };
    const list = await this.prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        client: true,
        broker: true,
        lead: { include: { interest: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    return list.map((c) => this.toConversation(c, false));
  }

  async findOne(id: string, user: JwtPayload) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        client: true,
        broker: true,
        lead: { include: { interest: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientId !== user.sub && conv.brokerId !== user.sub) {
      throw new ForbiddenException('Sem permissão para esta conversa');
    }
    return this.toConversation(conv, true);
  }

  async create(dto: CreateConversationDto, brokerId: string) {
    if (dto.brokerId !== brokerId) {
      throw new ForbiddenException('Só é possível criar conversa para si mesmo');
    }
    const existingConversation = await this.prisma.conversation.findUnique({
      where: { leadId: dto.leadId },
    });
    if (existingConversation) {
      throw new ConflictException('Já existe uma conversa para este lead');
    }
    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.leadId },
      include: { interest: { include: { compraOuAluguel: true, tipoImovel: true } } },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    if (lead.interest.clientId !== dto.clientId) {
      throw new ForbiddenException('Cliente não corresponde ao lead');
    }
    const summary = buildSummary(lead.interest);
    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          clientId: dto.clientId,
          brokerId: dto.brokerId,
          leadId: dto.leadId,
          propertyInterestSummary: summary,
        },
        include: {
          client: true,
          broker: true,
          lead: { include: { interest: true } },
          messages: true,
        },
      });
      return this.toConversation(conversation, false);
    } catch (err: unknown) {
      const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : null;
      if (code === 'P2002') {
        throw new ConflictException('Já existe conversa para este lead');
      }
      throw err;
    }
  }

  async createMessage(
    conversationId: string,
    user: JwtPayload,
    dto: CreateMessageDto,
  ) {
    const conv = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientId !== user.sub && conv.brokerId !== user.sub) {
      throw new ForbiddenException('Sem permissão para esta conversa');
    }
    const senderType: SenderType = conv.clientId === user.sub ? SenderType.client : SenderType.broker;
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: user.sub,
        senderType,
        content: dto.content,
        imageUrl: dto.imageUrl ?? undefined,
      },
    });
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    return {
      id: message.id,
      senderId: message.senderId,
      senderType: message.senderType,
      content: message.content,
      imageUrl: message.imageUrl,
      createdAt: message.createdAt.toISOString(),
    };
  }

  private toConversation(
    c: {
      id: string;
      clientId: string;
      brokerId: string;
      leadId: string;
      propertyInterestSummary: string;
      updatedAt: Date;
      client: { name: string; avatar: string | null };
      broker: { name: string; avatar: string | null };
      lead: { interest: unknown };
      messages: Array<{
        id: string;
        senderId: string;
        senderType: SenderType;
        content: string;
        imageUrl: string | null;
        createdAt: Date;
      }>;
    },
    withMessages: boolean,
  ) {
    const last = c.messages[0];
    return {
      id: c.id,
      clientId: c.clientId,
      clientName: c.client.name,
      clientAvatar: c.client.avatar,
      brokerId: c.brokerId,
      brokerName: c.broker.name,
      brokerAvatar: c.broker.avatar,
      leadId: c.leadId,
      propertyInterest: c.propertyInterestSummary,
      messages: withMessages
        ? c.messages.map((m) => ({
            id: m.id,
            senderId: m.senderId,
            senderType: m.senderType,
            content: m.content,
            imageUrl: m.imageUrl,
            createdAt: m.createdAt.toISOString(),
          }))
        : [],
      lastMessage: last
        ? {
            id: last.id,
            senderId: last.senderId,
            senderType: last.senderType,
            content: last.content,
            imageUrl: last.imageUrl,
            createdAt: last.createdAt.toISOString(),
          }
        : null,
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}
