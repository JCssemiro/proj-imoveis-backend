export declare class RegisterClientDto {
    name: string;
    email: string;
    phone: string;
    cpf: string;
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
    subscriptionActive?: boolean;
}
export type RegisterDto = RegisterClientDto | RegisterBrokerDto;
