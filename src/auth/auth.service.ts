import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterClientDto, RegisterBrokerDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { tipousuario } from '@prisma/client';
import { randomBytes } from 'crypto';
import { Decimal } from '@prisma/client/runtime/library';
import { decimalToNumber } from '../common/utils/decimal';

const SALT_ROUNDS = 10;

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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { plano: true },
    });
    if (!user || user.tipo !== dto.type) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }
    const valid = await bcrypt.compare(dto.password, user.senhahash);
    if (!valid) throw new UnauthorizedException('E-mail ou senha inválidos');
    return this.buildAuthResponse(user);
  }

  async registerClient(dto: RegisterClientDto): Promise<AuthResponse> {
    const existing = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const created = await this.prisma.usuario.create({
      data: {
        nome: dto.name,
        email: dto.email,
        telefone: dto.phone,
        senhahash: passwordHash,
        tipo: tipousuario.client,
      },
    });
    const user = await this.prisma.usuario.findUniqueOrThrow({
      where: { id: created.id },
      include: { plano: true },
    });
    return this.buildAuthResponse(user);
  }

  async registerBroker(dto: RegisterBrokerDto): Promise<AuthResponse> {
    const existing = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const existingCreci = await this.prisma.usuario.findFirst({ where: { creci: dto.creci } });
    if (existingCreci) throw new ConflictException('CRECI já cadastrado');

    const planoCodigo = dto.planoCodigo ?? 2;
    const planOk = await this.prisma.plano.findFirst({ where: { codigo: planoCodigo, ativo: true } });
    if (!planOk) throw new BadRequestException('planoCodigo inválido para cadastro de corretor');

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const created = await this.prisma.usuario.create({
      data: {
        nome: dto.name,
        email: dto.email,
        telefone: dto.phone,
        creci: dto.creci,
        senhahash: passwordHash,
        tipo: tipousuario.broker,
        ativoassinatura: dto.subscriptionActive ?? true,
        planocodigo: planoCodigo,
      },
    });
    const user = await this.prisma.usuario.findUniqueOrThrow({
      where: { id: created.id },
      include: { plano: true },
    });
    return this.buildAuthResponse(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!user) return;
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this.prisma.usuario.update({
      where: { id: user.id },
      data: { tokenresetarsenha: token, expiraresetarsenha: expires },
    });
  }

  private buildAuthResponse(
    user: {
      id: string;
      nome: string;
      email: string;
      telefone: string;
      creci: string | null;
      ativoassinatura: boolean | null;
      avatar: string | null;
      tipo: tipousuario;
      plano: { codigo: number; nome: string; precomensal: Decimal } | null;
    },
  ): AuthResponse {
    const token = this.jwt.sign(
      { sub: user.id, email: user.email, type: user.tipo },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    );
    const plan: AuthUserPlan = user.plano
      ? {
          codigo: user.plano.codigo,
          nome: user.plano.nome,
          precoMensal: decimalToNumber(user.plano.precomensal),
        }
      : null;
    return {
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
        phone: user.telefone,
        type: user.tipo as 'client' | 'broker',
        avatar: user.avatar,
        creci: user.creci,
        subscriptionActive: user.ativoassinatura,
        plan,
      },
      token,
    };
  }
}
