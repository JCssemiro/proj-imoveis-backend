import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto, RegisterBrokerDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login (cliente ou corretor)' })
  @ApiResponse({ status: 200, description: 'Retorna access_token e dados do usuário' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro (cliente ou corretor)' })
  @ApiResponse({ status: 201, description: 'Usuário criado' })
  register(@Body() dto: RegisterClientDto | RegisterBrokerDto) {
    if (dto.type === 'broker') {
      return this.auth.registerBroker(dto as RegisterBrokerDto);
    }
    return this.auth.registerClient(dto as RegisterClientDto);
  }

  @Post('recuperar-senha')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiResponse({ status: 200, description: 'E-mail enviado (ou sucesso silencioso)' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.auth.forgotPassword(dto).then(() => ({}));
  }
}
