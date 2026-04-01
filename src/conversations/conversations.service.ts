import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { tiporemetente } from '@prisma/client';
import { isClosedStatus } from '../common/constants/status-lead';
import { decimalToNumber } from '../common/utils/decimal';
import { Decimal } from '@prisma/client/runtime/library';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { getPaginationParams } from '../common/dto/pagination-query.dto';
import { buildPaginatedResponse } from '../common/dto/paginated-response.dto';

function buildSummary(interesse: {
  localizacoes: Array<{ bairro: string | null; cidade: string | null; cep: string | null }>;
  minprice: Decimal | number;
  maxprice: Decimal | number;
  finalidadecontratacao: { nome: string };
  tipoimovel: { nome: string };
}): string {
  const locPart =
    interesse.localizacoes?.length > 0
      ? interesse.localizacoes
          .map((l) => l.bairro || l.cidade || l.cep || '')
          .filter(Boolean)
          .join(', ') || 'N/A'
      : 'N/A';
  const fc = interesse.finalidadecontratacao?.nome ?? 'N/A';
  const tipo = interesse.tipoimovel?.nome ?? 'N/A';
  return `${fc} - ${tipo} em ${locPart} - R$ ${decimalToNumber(interesse.minprice)} a R$ ${decimalToNumber(interesse.maxprice)}`;
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
      userType === 'client' ? { clientid: userId } : { corretorid: userId };
    const [total, list] = await Promise.all([
      this.prisma.conversa.count({ where }),
      this.prisma.conversa.findMany({
        where,
        orderBy: { atualizadoem: 'desc' },
        include: {
          client: true,
          corretor: true,
          interesseimovel: { include: { tipoimovel: true } },
          mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
        },
        skip,
        take: size,
      }),
    ]);
    return buildPaginatedResponse(page, size, total, list.map((c) => this.toConversation(c, false)));
  }

  async findOne(id: string, user: JwtPayload) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id },
      include: {
        client: true,
        corretor: true,
        interesseimovel: { include: { tipoimovel: true } },
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
    const interesse = await this.prisma.interesseimovel.findUnique({
      where: { id: dto.interesseImovelId },
      include: {
        tipoimovel: true,
        finalidadecontratacao: true,
        localizacoes: true,
      },
    });
    if (!interesse) throw new NotFoundException('Interesse não encontrado');
    if (isClosedStatus(interesse.status) || !interesse.ativo) {
      throw new ForbiddenException('Este interesse está encerrado ou inativo. Não é possível abrir conversa.');
    }
    // Vários corretores podem ter conversas distintas sobre o mesmo interesse; aqui só evitamos duplicata (mesmo corretor + mesmo interesse + ativo).
    const chatAberto = await this.prisma.conversa.findFirst({
      where: {
        interesseimovelid: dto.interesseImovelId,
        corretorid: dto.brokerId,
        ativo: true,
      },
    });
    if (chatAberto) {
      throw new ConflictException('Já existe uma conversa aberta entre você e este cliente para este interesse.');
    }
    if (interesse.clientid !== dto.clientId) {
      throw new ForbiddenException('Cliente não corresponde ao interesse');
    }
    const summary = buildSummary(interesse).slice(0, 512);
    const conversation = await this.prisma.conversa.create({
      data: {
        clientid: dto.clientId,
        corretorid: dto.brokerId,
        interesseimovelid: dto.interesseImovelId,
        resumointeresse: summary,
      },
      include: {
        client: true,
        corretor: true,
        interesseimovel: { include: { tipoimovel: true } },
        mensagens: true,
      },
    });
    return this.toConversation(conversation, false);
  }

  async encerrar(conversationId: string, clientId: string) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id: conversationId },
      include: {
        client: true,
        corretor: true,
        interesseimovel: { include: { tipoimovel: true } },
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
        interesseimovel: { include: { tipoimovel: true } },
        mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
      },
    });
    return this.toConversation(updated, false);
  }

  async createMessage(conversationId: string, user: JwtPayload, dto: CreateMessageDto) {
    const conv = await this.prisma.conversa.findUnique({
      where: { id: conversationId },
    });
    if (!conv) throw new NotFoundException('Conversa não encontrada');
    if (conv.clientid !== user.sub && conv.corretorid !== user.sub) {
      throw new ForbiddenException('Sem permissão para esta conversa');
    }
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
      interesseimovelid: string;
      resumointeresse: string;
      atualizadoem: Date;
      client: { nome: string; avatar: string | null };
      corretor: { nome: string; avatar: string | null };
      interesseimovel: { id: string; tipoimovel: { nome: string } };
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
      leadId: c.interesseimovelid,
      interesseImovelId: c.interesseimovelid,
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
