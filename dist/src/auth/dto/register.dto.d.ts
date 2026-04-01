export declare class RegisterClientDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    type: 'client';
}
export declare class RegisterBrokerDto {
    name: string;
    email: string;
    phone: string;
    creci: string;
    password: string;
    type: 'broker';
    planoCodigo?: number;
    subscriptionActive?: boolean;
}
export type RegisterDto = RegisterClientDto | RegisterBrokerDto;
