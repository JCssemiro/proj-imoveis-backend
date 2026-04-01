import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export type UserPlanPayload = {
    codigo: number;
    nome: string;
    precoMensal: number;
} | null;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
        plan: UserPlanPayload;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
        plan: UserPlanPayload;
    }>;
    changeBrokerPlan(brokerId: string, planoCodigo: number): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
        plan: UserPlanPayload;
    }>;
    private planFromRow;
    private toUserResponse;
}
