import { LeadsService } from './leads.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsController {
    private leads;
    constructor(leads: LeadsService);
    findAll(_brokerId: string, pagina?: string, tamanho?: string, status?: string, tipoImovelCodigo?: string, finalidadeContratacaoCodigo?: string, finalidadeUsoCodigo?: string, mobiliaCodigo?: string, compraOuAluguel?: string, regiao?: string, minPrice?: string, maxPrice?: string, dataInicio?: string, dataFim?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<{
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
    update(id: string, dto: UpdateLeadDto, _brokerId: string): Promise<{
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
