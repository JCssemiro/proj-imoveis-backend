import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto, RegisterBrokerDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    register(dto: RegisterClientDto | RegisterBrokerDto): Promise<import("./auth.service").AuthResponse>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{}>;
}
