import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret || secret.trim() === '') {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET é obrigatório em produção. Defina a variável de ambiente.');
      }
      throw new Error('JWT_SECRET é obrigatório. Defina no .env (ex.: JWT_SECRET=chave-segura).');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub: string; email: string; type: string }): Promise<JwtPayload> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
    });
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return {
      sub: user.id,
      email: user.email,
      type: user.type as 'client' | 'broker',
    };
  }
}
