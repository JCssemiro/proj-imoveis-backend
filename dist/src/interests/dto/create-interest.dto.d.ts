import { LocalizacaoInteresseDto } from './localizacao-interesse.dto';
export declare class CreateInterestDto {
    localizacoes?: LocalizacaoInteresseDto[];
    compraOuAluguel: 'compra' | 'aluguel';
    finalidadeId: string;
    tipoImovelId: string;
    tipoCasaId?: string;
    quartos?: string;
    suites?: string | null;
    banheiros?: string | null;
    garagens?: string | null;
    metragemTerreno?: string | null;
    areaConstruida?: string;
    mobiliaId?: string;
    valorMinimo?: number | null;
    valorMaximo?: number | null;
    featureIds?: string[];
    observacoes?: string;
}
