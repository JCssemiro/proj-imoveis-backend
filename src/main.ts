import { config } from 'dotenv';
import { resolve } from 'path';

// Garante que .env seja carregado antes do Prisma e de qualquer módulo
config({ path: resolve(process.cwd(), '.env') });

import { createApp } from './app.factory';

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;
  await app.listen(port, '0.0.0.0');
  console.log(`ImobiConnect API running at http://localhost:${port}/api/v1`);
  console.log(`Swagger docs at http://localhost:${port}/api/v1/docs`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
