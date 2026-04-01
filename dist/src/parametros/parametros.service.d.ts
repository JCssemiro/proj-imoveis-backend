import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export interface ParametroItem {
    codigo: number;
    nome: string;
}
export interface TipoImovelParametro extends ParametroItem {
    finalidadeUsoCodigo: number;
}
export interface PlanoParametro extends ParametroItem {
    precoMensal: number;
}
export declare class ParametrosService {
    private prisma;
    constructor(prisma: PrismaService);
    private paginateParam;
    getFinalidadeUsoPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getFinalidadeContratacaoPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getTiposImovelPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<TipoImovelParametro>>;
    getMobiliasPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getUrgenciaPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getPlanosPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<PlanoParametro>>;
    getAll(): Promise<{
        finalidadeuso: ParametroItem[];
        finalidadecontratacao: ParametroItem[];
        tipoimovel: TipoImovelParametro[];
        mobilia: ParametroItem[];
        urgencia: ParametroItem[];
        plano: PlanoParametro[];
    }>;
}
