import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        cpf: string | null;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        cpf: string | null;
        type: string;
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
    }>;
    private toUserResponse;
}
