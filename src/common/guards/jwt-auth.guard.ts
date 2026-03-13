import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    // Rotas de documentação e health: liberar por path (Vercel/rewrites podem alterar o formato)
    const request = context.switchToHttp().getRequest();
    const rawPath =
      request.url ??
      request.raw?.url ??
      request.routerPath ??
      request.path ??
      request.pathname ??
      '';
    const path = rawPath.toString().split('?')[0].toLowerCase();
    const isHealth =
      path === '/api/v1/health' ||
      path.endsWith('/health') ||
      path.includes('health');
    const isDocs =
      path.startsWith('/api/v1/docs') ||
      path.includes('/docs') ||
      path.includes('docs');
    if (isHealth || isDocs) return true;
    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }
}
