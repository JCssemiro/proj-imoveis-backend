/**
 * Entrypoint para deploy na Vercel (serverless).
 * A Vercel detecta src/index.ts como entrypoint para aplicações Fastify/Node.
 * Não usar em desenvolvimento local — use `npm run dev` (main.ts).
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

import type { IncomingMessage, ServerResponse } from 'http';
// Import explícito para a Vercel detectar este arquivo como entrypoint NestJS
import '@nestjs/core';
import { createApp } from './app.factory';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';

declare global {
  // eslint-disable-next-line no-var
  var __nestApp__: NestFastifyApplication | undefined;
}

async function getApp(): Promise<NestFastifyApplication> {
  if (global.__nestApp__) {
    return global.__nestApp__;
  }
  const app = await createApp();
  // listen(0) cria o servidor HTTP interno do Fastify (necessário para emit('request', req, res))
  await app.listen(0, '0.0.0.0');
  (global as typeof globalThis).__nestApp__ = app;
  return app;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const app = await getApp();
  const fastify = app.getHttpAdapter().getInstance();
  fastify.server.emit('request', req, res);
}
