import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
export interface ParametroItem {
    id: string;
    codigo: string;
    label: string;
    ordem: number;
}
export declare class ParametrosService {
    private prisma;
    constructor(prisma: PrismaService);
    getFinalidades(): Promise<ParametroItem[]>;
    getFinalidadesPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getTiposImovel(): Promise<ParametroItem[]>;
    getTiposImovelPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getTiposCasa(): Promise<ParametroItem[]>;
    getTiposCasaPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getMobilias(): Promise<ParametroItem[]>;
    getMobiliasPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getFeatures(): Promise<ParametroItem[]>;
    getFeaturesPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getPlanos(): Promise<ParametroItem[]>;
    getPlanosPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<ParametroItem>>;
    getCompraOuAluguel(): {
        valor: string;
        label: string;
        ordem: number;
    }[];
    getCompraOuAluguelPaginado(pagination: {
        pagina?: number | string;
        tamanho?: number | string;
    }): Promise<PaginatedResponseDto<{
        valor: string;
        label: string;
        ordem: number;
    }>>;
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
}
