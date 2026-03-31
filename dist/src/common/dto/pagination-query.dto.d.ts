export declare class PaginationQueryDto {
    pagina?: number;
    tamanho?: number;
}
export type PaginationParams = {
    page: number;
    size: number;
    skip: number;
};
export declare function getPaginationParams(query: {
    pagina?: number | string;
    tamanho?: number | string;
}): PaginationParams;
