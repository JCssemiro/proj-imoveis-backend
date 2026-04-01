import { LocalizacaoInteresseDto } from './localizacao-interesse.dto';
export declare class CreateInterestDto {
    localizacoes?: LocalizacaoInteresseDto[];
    finalidadeContratacaoCodigo: number;
    finalidadeUsoCodigo: number;
    tipoImovelCodigo: number;
    mobiliaCodigo: number;
    urgenciaCodigo: number;
    aceitaFinanciamento: boolean;
    quartos?: number[];
    suites?: number[];
    metragem?: number | null;
    valorMinimo?: number | null;
    valorMaximo?: number | null;
    observacoes?: string;
}
