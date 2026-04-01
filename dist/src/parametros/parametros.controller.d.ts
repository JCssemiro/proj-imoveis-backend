import { ParametrosService } from './parametros.service';
export declare class ParametrosController {
    private parametros;
    constructor(parametros: ParametrosService);
    getAll(): Promise<{
        finalidadeuso: import("./parametros.service").ParametroItem[];
        finalidadecontratacao: import("./parametros.service").ParametroItem[];
        tipoimovel: import("./parametros.service").TipoImovelParametro[];
        mobilia: import("./parametros.service").ParametroItem[];
        urgencia: import("./parametros.service").ParametroItem[];
        plano: import("./parametros.service").PlanoParametro[];
    }>;
    getFinalidadeUso(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").ParametroItem>>;
    getFinalidadeContratacao(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").ParametroItem>>;
    getTiposImovel(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").TipoImovelParametro>>;
    getMobilias(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").ParametroItem>>;
    getUrgencia(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").ParametroItem>>;
    getPlanos(pagina?: string, tamanho?: string): Promise<import("../common/dto/paginated-response.dto").PaginatedResponseDto<import("./parametros.service").PlanoParametro>>;
}
