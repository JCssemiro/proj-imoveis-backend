import { Controller, Get, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

const SWAGGER_UI_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';

/**
 * Redireciona requests dos assets do Swagger UI para o CDN.
 * Necessário na Vercel (serverless), onde os arquivos estáticos do swagger-ui-dist não existem no bundle.
 * Rotas: api/v1/docs/swagger-ui.css, .../swagger-ui-bundle.js, .../swagger-ui-standalone-preset.js
 */
@Controller('docs')
export class SwaggerAssetsController {
  @Get('swagger-ui.css')
  redirectCss(@Res() res: FastifyReply) {
    return res.redirect(`${SWAGGER_UI_CDN}/swagger-ui.css`, 302);
  }

  @Get('swagger-ui-bundle.js')
  redirectBundle(@Res() res: FastifyReply) {
    return res.redirect(`${SWAGGER_UI_CDN}/swagger-ui-bundle.js`, 302);
  }

  @Get('swagger-ui-standalone-preset.js')
  redirectStandalonePreset(@Res() res: FastifyReply) {
    return res.redirect(`${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js`, 302);
  }
}
