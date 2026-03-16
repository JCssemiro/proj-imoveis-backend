import type { IncomingMessage, ServerResponse } from 'http';
import '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
declare global {
    var __nestApp__: NestFastifyApplication | undefined;
}
export default function handler(req: IncomingMessage, res: ServerResponse): Promise<void>;
