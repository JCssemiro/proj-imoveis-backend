import { PrismaService } from '../prisma/prisma.service';
export declare class BrokersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        creci: string;
        avatar: string | null;
        specialties: string[];
        rating: number;
        totalLeads: number;
    }[]>;
}
