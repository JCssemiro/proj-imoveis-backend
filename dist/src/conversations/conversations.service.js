"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const pagination_query_dto_1 = require("../common/dto/pagination-query.dto");
const paginated_response_dto_1 = require("../common/dto/paginated-response.dto");
function buildSummary(interest) {
    const locPart = interest.localizacoes?.length > 0
        ? interest.localizacoes
            .map((l) => l.bairro || l.cep || l.municipiocodibge || '')
            .filter(Boolean)
            .join(', ') || 'N/A'
        : 'N/A';
    const compra = interest.compraoualuguel ?? 'N/A';
    const tipo = interest.tipoimovel?.label ?? interest.tipoimovel?.codigo ?? 'N/A';
    return `${compra} - ${tipo} em ${locPart} - R$ ${interest.minprice} a R$ ${interest.maxprice}`;
}
let ConversationsService = class ConversationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, userType, pagination) {
        const { page, size, skip } = (0, pagination_query_dto_1.getPaginationParams)(pagination);
        const where = userType === 'client'
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
        return (0, paginated_response_dto_1.buildPaginatedResponse)(page, size, total, conteudo);
    }
    async findOne(id, user) {
        const conv = await this.prisma.conversa.findUnique({
            where: { id },
            include: {
                client: true,
                corretor: true,
                lead: { include: { interesse: { include: { tipoimovel: true } } } },
                mensagens: { orderBy: { criadoem: 'asc' } },
            },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversa não encontrada');
        if (conv.clientid !== user.sub && conv.corretorid !== user.sub) {
            throw new common_1.ForbiddenException('Sem permissão para esta conversa');
        }
        return this.toConversation(conv, true);
    }
    async create(dto, brokerId) {
        if (dto.brokerId !== brokerId) {
            throw new common_1.ForbiddenException('Só é possível criar conversa para si mesmo');
        }
        const existingConversation = await this.prisma.conversa.findFirst({
            where: { corretorid: dto.brokerId, ativo: true },
        });
        if (existingConversation) {
            throw new common_1.ConflictException('Já existe um chat aberto para este corretor. Encerrar o chat atual para iniciar outro.');
        }
        const lead = await this.prisma.prospecto.findUnique({
            where: { id: dto.leadId },
            include: { interesse: { include: { tipoimovel: true, localizacoes: true } } },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        if (lead.interesse.clientid !== dto.clientId) {
            throw new common_1.ForbiddenException('Cliente não corresponde ao lead');
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
        }
        catch (err) {
            const code = err && typeof err === 'object' && 'code' in err ? err.code : null;
            if (code === 'P2002') {
                throw new common_1.ConflictException('Já existe conversa aberta para este lead e corretor');
            }
            throw err;
        }
    }
    async encerrar(conversationId, clientId) {
        const conv = await this.prisma.conversa.findUnique({
            where: { id: conversationId },
            include: {
                client: true,
                corretor: true,
                lead: { include: { interesse: { include: { tipoimovel: true } } } },
                mensagens: { orderBy: { criadoem: 'desc' }, take: 1 },
            },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversa não encontrada');
        if (conv.clientid !== clientId)
            throw new common_1.ForbiddenException('Só o cliente pode encerrar este chat');
        if (!conv.ativo)
            return this.toConversation(conv, false);
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
    async createMessage(conversationId, user, dto) {
        const conv = await this.prisma.conversa.findUnique({
            where: { id: conversationId },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversa não encontrada');
        if (conv.clientid !== user.sub && conv.corretorid !== user.sub) {
            throw new common_1.ForbiddenException('Sem permissão para esta conversa');
        }
        if (!conv.ativo && conv.corretorid === user.sub) {
            throw new common_1.ForbiddenException('Chat encerrado pelo cliente. O corretor não pode enviar mensagens.');
        }
        const senderType = conv.clientid === user.sub ? client_1.tiporemetente.client : client_1.tiporemetente.broker;
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
    toConversation(c, withMessages) {
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
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map