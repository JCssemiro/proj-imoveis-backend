/**
 * Entrypoint para deploy na Vercel (serverless).
 * Não usar em desenvolvimento local — use `npm run dev` (main.ts).
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

import type { IncomingMessage, ServerResponse } from 'http';
// Import explícito para o detector da Vercel reconhecer este entrypoint como app NestJS
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
  await app.init();
  await app.listen(0, '0.0.0.0');
  (global as typeof globalThis).__nestApp__ = app;
  return app;
}

function sendError(res: ServerResponse, statusCode: number, body: string): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(body);
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    // Vercel com rewrite para /api: restaurar path original (__path no query ou header x-url).
    const rawUrl = req.url || '/';
    let pathToUse: string | null = null;
    if (rawUrl.includes('__path=')) {
      try {
        pathToUse = new URL(rawUrl, 'http://x').searchParams.get('__path');
        if (pathToUse != null) pathToUse = '/' + pathToUse;
      } catch { /* ignore */ }
    }
    if (pathToUse == null) {
      const h = req.headers['x-url'] ?? req.headers['x-original-url'];
      const hv = typeof h === 'string' ? h : Array.isArray(h) ? h[0] : null;
      if (hv) pathToUse = hv.startsWith('http') ? new URL(hv).pathname : hv;
    }
    if (pathToUse != null) (req as IncomingMessage & { url: string }).url = pathToUse;
    const app = await getApp();
    const fastify = app.getHttpAdapter().getInstance();
    await fastify.ready();
    fastify.server.emit('request', req, res);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    const code = process.env.NODE_ENV === 'production' ? 500 : 500;
    sendError(
      res,
      code,
      JSON.stringify({ code: 'FUNCTION_INVOCATION_FAILED', message }),
    );
  }
}
