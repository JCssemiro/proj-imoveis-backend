import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    private toPropertyInterest;
    findAll(brokerId: string, filters: {
        status?: string;
        tipoImovelId?: string;
        finalidadeId?: string;
        tipoCasaId?: string;
        mobiliaId?: string;
        compraOuAluguel?: string;
        regiao?: string;
        minPrice?: number;
        maxPrice?: number;
        dataInicio?: string;
        dataFim?: string;
    }, pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<{
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
        status: import(".prisma/client").$Enums.statuslead;
        createdAt: string;
    }>>;
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
        status: import(".prisma/client").$Enums.statuslead;
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
        status: import(".prisma/client").$Enums.statuslead;
        createdAt: string;
    }>;
}
