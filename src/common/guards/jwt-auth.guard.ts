import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/** Paths liberados sem JWT (global prefix /api/v1 já aplicado nas URLs do Fastify). */
const PUBLIC_GET_PATHS = new Set(['/api/v1/health', '/api/v1/docs', '/api/v1/docs-json']);

const PUBLIC_AUTH_POST_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/recuperar-senha',
]);

function normalizeRequestPath(raw: string): string {
  const withoutQuery = raw.split('?')[0] || '/';
  let pathname = withoutQuery;
  try {
    if (withoutQuery.includes('://')) pathname = new URL(withoutQuery).pathname;
  } catch {
    /* usa sem query */
  }
  const lower = pathname.toLowerCase();
  return lower.length > 1 && lower.endsWith('/') ? lower.slice(0, -1) : lower;
}

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

    const request = context.switchToHttp().getRequest<{
      method?: string;
      url?: string;
      raw?: { url?: string };
      routerPath?: string;
      path?: string;
    }>();
    const method = (request.method || 'GET').toUpperCase();
    const rawPath =
      request.url ?? request.raw?.url ?? request.routerPath ?? request.path ?? '';
    const path = normalizeRequestPath(String(rawPath));

    if (method === 'GET' && PUBLIC_GET_PATHS.has(path)) return true;
    if (method === 'POST' && PUBLIC_AUTH_POST_PATHS.has(path)) return true;

    return super.canActivate(context);
  }

  handleRequest<TUser>(err: Error | null, user: TUser): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user;
  }
}
