import { ParametrosService, ParametroItem } from './parametros.service';
export declare class ParametrosController {
    private parametros;
    constructor(parametros: ParametrosService);
    getAll(): Promise<{
        finalidade: ParametroItem[];
        tipoimovel: ParametroItem[];
        tipocasa: ParametroItem[];
        mobilia: ParametroItem[];
        feature: ParametroItem[];
        plano: ParametroItem[];
        compraoualuguel: {
            valor: string;
            label: string;
            ordem: number;
        }[];
    }>;
    getFinalidades(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getTiposImovel(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getTiposCasa(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getMobilias(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getFeatures(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getPlanos(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<ParametroItem>>;
    getCompraOuAluguel(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<{
        valor: string;
        label: string;
        ordem: number;
    }>>;
}
