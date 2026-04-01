import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhahash = await bcrypt.hash('senha123', 10);

  const client = await prisma.usuario.upsert({
    where: { email: 'cliente@example.com' },
    update: {},
    create: {
      nome: 'Cliente Exemplo',
      email: 'cliente@example.com',
      telefone: '11999999999',
      senhahash,
      tipo: 'client',
    },
  });

  const broker = await prisma.usuario.upsert({
    where: { email: 'corretor@example.com' },
    update: {},
    create: {
      nome: 'Corretor Exemplo',
      email: 'corretor@example.com',
      telefone: '11888888888',
      senhahash,
      tipo: 'broker',
      creci: 'CRECI-12345',
      planocodigo: 2,
      ativoassinatura: true,
    },
  });

  console.log('Seed: parâmetros já estão na migration inicial. Usuários de exemplo:', {
    client: client.email,
    broker: broker.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
