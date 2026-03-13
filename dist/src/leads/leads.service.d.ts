import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    private toPropertyInterest;
    findAll(brokerId: string, filters: {
        status?: string;
        tipoImovel?: string;
        regiao?: string;
        maxPrice?: number;
    }): Promise<{
        id: string;
        interest: {
            id: string;
            clientId: string;
            clientName: string;
            clientPhone: string;
            clientEmail: string;
            locations: string[];
            compraOuAluguel: string;
            finalidade: string;
            tipoImovel: string;
            tipoCasa: string;
            quartos: string;
            suites: string;
            metragemTerreno: string;
            areaConstruida: string;
            mobilia: string;
            minPrice: number;
            maxPrice: number;
            features: string[];
            notes: string;
            createdAt: string;
            isActive: boolean;
        };
        brokerId: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        interest: {
            id: string;
            clientId: string;
            clientName: string;
            clientPhone: string;
            clientEmail: string;
            locations: string[];
            compraOuAluguel: string;
            finalidade: string;
            tipoImovel: string;
            tipoCasa: string;
            quartos: string;
            suites: string;
            metragemTerreno: string;
            areaConstruida: string;
            mobilia: string;
            minPrice: number;
            maxPrice: number;
            features: string[];
            notes: string;
            createdAt: string;
            isActive: boolean;
        };
        brokerId: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: string;
    }>;
    update(id: string, dto: UpdateLeadDto, currentBrokerId: string): Promise<{
        id: string;
        interest: {
            id: string;
            clientId: string;
            clientName: string;
            clientPhone: string;
            clientEmail: string;
            locations: string[];
            compraOuAluguel: string;
            finalidade: string;
            tipoImovel: string;
            tipoCasa: string;
            quartos: string;
            suites: string;
            metragemTerreno: string;
            areaConstruida: string;
            mobilia: string;
            minPrice: number;
            maxPrice: number;
            features: string[];
            notes: string;
            createdAt: string;
            isActive: boolean;
        };
        brokerId: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        createdAt: string;
    }>;
}
