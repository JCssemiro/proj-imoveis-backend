import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';
export declare class ConversationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, userType: 'client' | 'broker'): Promise<{
        id: string;
        clientId: string;
        clientName: string;
        clientAvatar: string | null;
        brokerId: string;
        brokerName: string;
        brokerAvatar: string | null;
        leadId: string;
        propertyInterest: string;
        messages: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        }[];
        lastMessage: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        } | null;
        updatedAt: string;
    }[]>;
    findOne(id: string, user: JwtPayload): Promise<{
        id: string;
        clientId: string;
        clientName: string;
        clientAvatar: string | null;
        brokerId: string;
        brokerName: string;
        brokerAvatar: string | null;
        leadId: string;
        propertyInterest: string;
        messages: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        }[];
        lastMessage: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        } | null;
        updatedAt: string;
    }>;
    create(dto: CreateConversationDto, brokerId: string): Promise<{
        id: string;
        clientId: string;
        clientName: string;
        clientAvatar: string | null;
        brokerId: string;
        brokerName: string;
        brokerAvatar: string | null;
        leadId: string;
        propertyInterest: string;
        messages: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        }[];
        lastMessage: {
            id: string;
            senderId: string;
            senderType: import(".prisma/client").$Enums.SenderType;
            content: string;
            imageUrl: string | null;
            createdAt: string;
        } | null;
        updatedAt: string;
    }>;
    createMessage(conversationId: string, user: JwtPayload, dto: CreateMessageDto): Promise<{
        id: string;
        senderId: string;
        senderType: import(".prisma/client").$Enums.SenderType;
        content: string;
        imageUrl: string | null;
        createdAt: string;
    }>;
    private toConversation;
}
