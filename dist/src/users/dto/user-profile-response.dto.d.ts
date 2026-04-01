export declare class UserPlanResponseDto {
    codigo: number;
    nome: string;
    precoMensal: number;
}
export declare class UserProfileResponseDto {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: string;
    avatar: string | null;
    creci: string | null;
    subscriptionActive: boolean | null;
    plan: UserPlanResponseDto | null;
}
