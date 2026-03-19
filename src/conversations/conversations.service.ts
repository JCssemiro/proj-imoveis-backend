import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { tiporemetente } from '@prisma/client';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse } from '../common/dto/paginated-response.dto';

function buildSummary(interest: {
  localizacoes: Array<{ cep: string | null; municipiocodibge: string | null; bairro: string | null }>;
  minprice: number;
  maxprice: number;
  compraoualuguel: string;
  tipoimovel: { codigo: string; label?: string };
}): string {
  const locPart =
    interest.localizacoes?.length > 0
      ? interest.localizacoes
          .map((l) => l.bairro || l.cep || l.municipiocodibge || '')
          .filter(Boolean)
          .join(', ') || 'N/A'
      : 'N/A';
  const compra = interest.compraoualuguel ?? 'N/A';
  const tipo = interest.tipoimovel?.label ?? interest.tipoimovel?.codigo ?? 'N/A';
  return `${compra} - ${tipo} em ${locPart} - R$ ${interest.minprice} a R$ ${interest.maxprice}`;
}

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    userId: string,
    userType: 'client' | 'broker',
    pagination: { pagina?: number | string; tamanho?: number | string },
  ) {
    const { page, size, skip } = getPaginationParams(pagination);
    const where =
      userType === 'client'
        ? { clientid: userId }
        : { corretorid: userId };
    const [total, list] = await Promise.all([
      this.prisma.conversa.count({ where }),
      this.prisma.conversa.findMany({
        where,
        orderBy: { atualizadoem: 'desc' },
        include: {
          client: true,
          corretor: true,
          lead: { include: { interesse: { include: { tipoimovel: true } } } },
          mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
        },
        skip,
        take: size,
      }),
    ]);
    const conteudo = list.map((c) => this.toConversation(c, false));
    return buildPaginatedResponse(page, size, total, conteudo);
  }

  async findOne(id: string, user: JwtPayload) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id },
      include: {
        client: true,
        corretor: true,
        lead: { include: { interesse: { include: { tipoimovel: true } } } },
        mensagens: { orderBy: { criadoem: 'asc' } },
      },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientid !== user.sub && conv.corretorid !== user.sub) {
      throw new ForbiddenException('Sem permissão para esta conversa');
    }
    return this.toConversation(conv, true);
  }

  async create(dto: CreateConversationDto, brokerId: string) {
    if (dto.brokerId !== brokerId) {
      throw new ForbiddenException('Só é possível criar conversa para si mesmo');
    }
    // Regra: bloquear criação apenas se o corretor SEU (dto.brokerId) já tiver uma conversa ABERTA
    // (ativo=true). Lead pode ter múltiplas conversas, mas o corretor deve estar com apenas 1 chat ativo.
    // Conversas encerradas podem ser substituídas por novas.
    const existingConversation = await this.prisma.conversa.findFirst({
      where: { corretorid: dto.brokerId, ativo: true },
    });
    if (existingConversation) {
      throw new ConflictException('Já existe um chat aberto para este corretor. Encerrar o chat atual para iniciar outro.');
    }
    const lead = await this.prisma.prospecto.findUnique({
      where: { id: dto.leadId },
      include: { interesse: { include: { tipoimovel: true, localizacoes: true } } },
    });
    if (!lead) throw new NotFoundException('Lead não encontrado');
    if (lead.interesse.clientid !== dto.clientId) {
      throw new ForbiddenException('Cliente não corresponde ao lead');
    }
    const summary = buildSummary(lead.interesse);
    try {
      const conversation = await this.prisma.conversa.create({
        data: {
          clientid: dto.clientId,
          corretorid: dto.brokerId,
          leadid: dto.leadId,
          resumointeresse: summary,
        },
        include: {
          client: true,
          corretor: true,
          lead: { include: { interesse: true } },
          mensagens: true,
        },
      });
      return this.toConversation(conversation, false);
    } catch (err: unknown) {
      const code = err && typeof err === 'object' && 'code' in err ? (err as { code: string }).code : null;
      if (code === 'P2002') {
        throw new ConflictException('Já existe conversa aberta para este lead e corretor');
      }
      throw err;
    }
  }

  async encerrar(conversationId: string, clientId: string) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id: conversationId },
      include: {
        client: true,
        corretor: true,
        lead: { include: { interesse: { include: { tipoimovel: true } } } },
        mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
      },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientid !== clientId) throw new ForbiddenException('Só o cliente pode encerrar este chat');
    if (!conv.ativo) return this.toConversation(conv, false);
    const updated = await this.prisma.conversa.update({
      where: { id: conversationId },
      data: { ativo: false, atualizadoem: new Date() },
      include: {
        client: true,
        corretor: true,
        lead: { include: { interesse: { include: { tipoimovel: true } } } },
        mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
      },
    });
    return this.toConversation(updated, false);
  }

  async createMessage(
    conversationId: string,
    user: JwtPayload,
    dto: CreateMessageDto,
  ) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientid !== user.sub && conv.corretorid !== user.sub) {
      throw new ForbiddenException('Sem permissão para esta conversa');
    }
    // Regra: após encerramento pelo cliente, o corretor não pode enviar mensagens.
    // O cliente pode continuar enviando (caso a UI/negócio permita).
    if (!conv.ativo && conv.corretorid === user.sub) {
      throw new ForbiddenException('Chat encerrado pelo cliente. O corretor não pode enviar mensagens.');
    }
    const senderType: tiporemetente =
      conv.clientid === user.sub ? tiporemetente.client : tiporemetente.broker;
    const message = await this.prisma.mensagem.create({
      data: {
        conversaid: conversationId,
        remetenteid: user.sub,
        tiporemetente: senderType,
        conteudo: dto.content,
        urlimagem: dto.imageUrl ?? undefined,
      },
    });
    await this.prisma.conversa.update({
      where: { id: conversationId },
      data: { atualizadoem: new Date() },
    });
    return {
      id: message.id,
      senderId: message.remetenteid,
      senderType: message.tiporemetente,
      content: message.conteudo,
      imageUrl: message.urlimagem,
      createdAt: message.criadoem.toISOString(),
    };
  }

  private toConversation(
    c: {
      id: string;
      clientid: string;
      corretorid: string;
      leadid: string;
      resumointeresse: string;
      atualizadoem: Date;
      client: { nome: string; avatar: string | null };
      corretor: { nome: string; avatar: string | null };
      lead: { interesse: unknown };
      mensagens: Array<{
        id: string;
        remetenteid: string;
        tiporemetente: tiporemetente;
        conteudo: string;
        urlimagem: string | null;
        criadoem: Date;
      }>;
    },
    withMessages: boolean,
  ) {
    const last = c.mensagens[0];
    return {
      id: c.id,
      clientId: c.clientid,
      clientName: c.client.nome,
      clientAvatar: c.client.avatar,
      brokerId: c.corretorid,
      brokerName: c.corretor.nome,
      brokerAvatar: c.corretor.avatar,
      leadId: c.leadid,
      propertyInterest: c.resumointeresse,
      messages: withMessages
        ? c.mensagens.map((m) => ({
            id: m.id,
            senderId: m.remetenteid,
            senderType: m.tiporemetente,
            content: m.conteudo,
            imageUrl: m.urlimagem,
            createdAt: m.criadoem.toISOString(),
          }))
        : [],
      lastMessage: last
        ? {
            id: last.id,
            senderId: last.remetenteid,
            senderType: last.tiporemetente,
            content: last.conteudo,
            imageUrl: last.urlimagem,
            createdAt: last.criadoem.toISOString(),
          }
        : null,
      updatedAt: c.atualizadoem.toISOString(),
    };
  }
}
