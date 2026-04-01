import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    private toInterestCard;
    findAll(_brokerId: string, filters: {
        status?: string;
        tipoImovelCodigo?: string;
        finalidadeContratacaoCodigo?: string;
        finalidadeUsoCodigo?: string;
        mobiliaCodigo?: string;
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
            finalidadeContratacao: string;
            finalidadeUso: string;
            tipoImovel: string;
            mobilia: string;
            urgencia: string;
            aceitaFinanciamento: boolean;
            quartos: number[];
            suites: number[];
            metragem: number | null;
            minPrice: number;
            maxPrice: number;
            notes: string;
            status: number;
            createdAt: string;
            isActive: boolean;
        };
        createdAt: string;
    }>>;
    findOne(id: string, _brokerId: string): Promise<{
        id: string;
        interest: {
            id: string;
            clientId: string;
            clientName: string;
            clientPhone: string;
            clientEmail: string;
            locations: string[];
            finalidadeContratacao: string;
            finalidadeUso: string;
            tipoImovel: string;
            mobilia: string;
            urgencia: string;
            aceitaFinanciamento: boolean;
            quartos: number[];
            suites: number[];
            metragem: number | null;
            minPrice: number;
            maxPrice: number;
            notes: string;
            status: number;
            createdAt: string;
            isActive: boolean;
        };
        createdAt: string;
    }>;
    update(id: string, dto: UpdateLeadDto, _currentBrokerId: string): Promise<{
        id: string;
        interest: {
            id: string;
            clientId: string;
            clientName: string;
            clientPhone: string;
            clientEmail: string;
            locations: string[];
            finalidadeContratacao: string;
            finalidadeUso: string;
            tipoImovel: string;
            mobilia: string;
            urgencia: string;
            aceitaFinanciamento: boolean;
            quartos: number[];
            suites: number[];
            metragem: number | null;
            minPrice: number;
            maxPrice: number;
            notes: string;
            status: number;
            createdAt: string;
            isActive: boolean;
        };
        createdAt: string;
    }>;
}
