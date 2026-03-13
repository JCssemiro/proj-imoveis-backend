import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

export function validateProductionEnv(): void {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
      throw new Error('JWT_SECRET é obrigatório em produção. Defina a variável de ambiente na Vercel.');
    }
    const unsafe = ['change-me', 'secret', 'jwt_secret'];
    if (unsafe.some((s) => process.env.JWT_SECRET?.toLowerCase().includes(s))) {
      throw new Error('Use um JWT_SECRET forte e único em produção.');
    }
  }
}

/**
 * Cria a aplicação Nest (Fastify) configurada, sem chamar listen().
 * Usado por main.ts (servidor local) e por src/index.ts (Vercel serverless).
 */
export async function createApp(): Promise<NestFastifyApplication> {
  validateProductionEnv();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({ origin: frontendUrl, credentials: true });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Servir assets do Swagger via proxy do CDN *antes* do SwaggerModule.setup(), para ter prioridade sobre useStaticAssets.
  const SWAGGER_UI_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';
  const docsPrefix = '/api/v1/docs';
  const fastify = app.getHttpAdapter().getInstance();

  async function proxySwaggerAsset(
    reply: { type: (t: string) => { send: (b: string) => unknown } },
    cdnPath: string,
    contentType: string,
  ): Promise<unknown> {
    const res = await fetch(`${SWAGGER_UI_CDN}/${cdnPath}`);
    const body = await res.text();
    return reply.type(contentType).send(body);
  }

  fastify.get(`${docsPrefix}/swagger-ui.css`, (_, reply) =>
    proxySwaggerAsset(reply, 'swagger-ui.css', 'text/css'),
  );
  fastify.get(`${docsPrefix}/swagger-ui-bundle.js`, (_, reply) =>
    proxySwaggerAsset(reply, 'swagger-ui-bundle.js', 'application/javascript'),
  );
  fastify.get(`${docsPrefix}/swagger-ui-standalone-preset.js`, (_, reply) =>
    proxySwaggerAsset(reply, 'swagger-ui-standalone-preset.js', 'application/javascript'),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ImobiConnect API')
    .setDescription('API do projeto ImobiConnect - gestão de imóveis, leads e conversas.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  return app;
}
