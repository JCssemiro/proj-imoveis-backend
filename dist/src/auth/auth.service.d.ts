import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto, RegisterBrokerDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export type AuthUserPlan = {
    codigo: number;
    nome: string;
    precoMensal: number;
} | null;
export interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
        type: 'client' | 'broker';
        avatar: string | null;
        creci: string | null;
        subscriptionActive: boolean | null;
        plan: AuthUserPlan;
    };
    token: string;
}
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    login(dto: LoginDto): Promise<AuthResponse>;
    registerClient(dto: RegisterClientDto): Promise<AuthResponse>;
    registerBroker(dto: RegisterBrokerDto): Promise<AuthResponse>;
    forgotPassword(dto: ForgotPasswordDto): Promise<void>;
    private buildAuthResponse;
}
