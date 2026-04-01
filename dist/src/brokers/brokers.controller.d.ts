import { BrokersService } from './brokers.service';
export declare class BrokersController {
    private brokers;
    constructor(brokers: BrokersService);
    findAll(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<{
        id: string;
        name: string;
        email: string;
        phone: string;
        creci: string;
        avatar: string | null;
        specialties: string[];
        rating: number;
        totalConversas: number;
    }>>;
}
