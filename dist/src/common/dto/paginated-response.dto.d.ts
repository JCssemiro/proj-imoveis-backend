export declare class PaginatedResponseDto<T> {
    paginaAtual: number;
    totalPaginas: number;
    qtdElementos: number;
    conteudo: T[];
    constructor(paginaAtual: number, totalPaginas: number, qtdElementos: number, conteudo: T[]);
}
export declare function buildPaginatedResponse<T>(page: number, size: number, total: number, conteudo: T[]): PaginatedResponseDto<T>;
