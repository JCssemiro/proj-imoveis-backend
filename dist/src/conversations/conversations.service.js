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
function buildSummary(interest) {
    const loc = interest.locations?.length ? interest.locations.join(', ') : 'N/A';
    const compra = interest.compraOuAluguel?.label ?? interest.compraOuAluguel?.codigo ?? 'N/A';
    const tipo = interest.tipoImovel?.label ?? interest.tipoImovel?.codigo ?? 'N/A';
    return `${compra} - ${tipo} em ${loc} - R$ ${interest.minPrice} a R$ ${interest.maxPrice}`;
}
let ConversationsService = class ConversationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, userType) {
        const where = userType === 'client'
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
    async findOne(id, user) {
        const conv = await this.prisma.conversation.findUnique({
            where: { id },
            include: {
                client: true,
                broker: true,
                lead: { include: { interest: true } },
                messages: { orderBy: { createdAt: 'asc' } },
            },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversa não encontrada');
        if (conv.clientId !== user.sub && conv.brokerId !== user.sub) {
            throw new common_1.ForbiddenException('Sem permissão para esta conversa');
        }
        return this.toConversation(conv, true);
    }
    async create(dto, brokerId) {
        if (dto.brokerId !== brokerId) {
            throw new common_1.ForbiddenException('Só é possível criar conversa para si mesmo');
        }
        const existingConversation = await this.prisma.conversation.findUnique({
            where: { leadId: dto.leadId },
        });
        if (existingConversation) {
            throw new common_1.ConflictException('Já existe uma conversa para este lead');
        }
        const lead = await this.prisma.lead.findUnique({
            where: { id: dto.leadId },
            include: { interest: { include: { compraOuAluguel: true, tipoImovel: true } } },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead não encontrado');
        if (lead.interest.clientId !== dto.clientId) {
            throw new common_1.ForbiddenException('Cliente não corresponde ao lead');
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
        }
        catch (err) {
            const code = err && typeof err === 'object' && 'code' in err ? err.code : null;
            if (code === 'P2002') {
                throw new common_1.ConflictException('Já existe conversa para este lead');
            }
            throw err;
        }
    }
    async createMessage(conversationId, user, dto) {
        const conv = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversa não encontrada');
        if (conv.clientId !== user.sub && conv.brokerId !== user.sub) {
            throw new common_1.ForbiddenException('Sem permissão para esta conversa');
        }
        const senderType = conv.clientId === user.sub ? client_1.SenderType.client : client_1.SenderType.broker;
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
    toConversation(c, withMessages) {
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
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map