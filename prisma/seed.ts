import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const finalidades = [
  { codigo: 'residencial', label: 'Residencial', ordem: 1 },
  { codigo: 'comercial', label: 'Comercial', ordem: 2 },
  { codigo: 'rural', label: 'Rural', ordem: 3 },
  { codigo: 'investimento', label: 'Investimento', ordem: 4 },
];

const tiposImovel = [
  { codigo: 'casa', label: 'Casa', ordem: 1 },
  { codigo: 'apartamento', label: 'Apartamento', ordem: 2 },
  { codigo: 'terreno', label: 'Terreno', ordem: 3 },
  { codigo: 'comercial', label: 'Comercial', ordem: 4 },
  { codigo: 'rural', label: 'Rural', ordem: 5 },
];

const tiposCasa = [
  { codigo: 'padrao', label: 'Padrão', ordem: 1 },
  { codigo: 'sobrado', label: 'Sobrado', ordem: 2 },
  { codigo: 'geminada', label: 'Geminada', ordem: 3 },
  { codigo: 'condominio', label: 'Em condomínio', ordem: 4 },
  { codigo: 'indiferente', label: 'Indiferente', ordem: 5 },
];

const compraOuAluguel = [
  { codigo: 'compra', label: 'Compra', ordem: 1 },
  { codigo: 'aluguel', label: 'Aluguel', ordem: 2 },
];

const mobilias = [
  { codigo: 'mobiliado', label: 'Mobiliado', ordem: 1 },
  { codigo: 'nao_mobiliado', label: 'Não mobiliado', ordem: 2 },
  { codigo: 'indiferente', label: 'Indiferente', ordem: 3 },
];

async function seedParametros() {
  for (const f of finalidades) {
    await prisma.finalidade.upsert({
      where: { codigo: f.codigo },
      update: { label: f.label, ordem: f.ordem },
      create: f,
    });
  }
  for (const t of tiposImovel) {
    await prisma.tipoimovel.upsert({
      where: { codigo: t.codigo },
      update: { label: t.label, ordem: t.ordem },
      create: t,
    });
  }
  for (const t of tiposCasa) {
    await prisma.tipocasa.upsert({
      where: { codigo: t.codigo },
      update: { label: t.label, ordem: t.ordem },
      create: t,
    });
  }
  for (const c of compraOuAluguel) {
    await prisma.compraoualuguel.upsert({
      where: { codigo: c.codigo },
      update: { label: c.label, ordem: c.ordem },
      create: c,
    });
  }
  for (const m of mobilias) {
    await prisma.mobilia.upsert({
      where: { codigo: m.codigo },
      update: { label: m.label, ordem: m.ordem },
      create: m,
    });
  }
  console.log('Seed: parâmetros (finalidade, tipoimovel, tipocasa, compraoualuguel, mobilia) criados/atualizados.');
}

async function main() {
  await seedParametros();

  const passwordHash = await bcrypt.hash('senha123', 10);

  const client = await prisma.usuario.upsert({
    where: { email: 'cliente@example.com' },
    update: {},
    create: {
      name: 'Cliente Exemplo',
      email: 'cliente@example.com',
      phone: '11999999999',
      passwordHash,
      type: 'client',
      cpf: '12345678900',
    },
  });

  const broker = await prisma.usuario.upsert({
    where: { email: 'corretor@example.com' },
    update: {},
    create: {
      name: 'Corretor Exemplo',
      email: 'corretor@example.com',
      phone: '11888888888',
      passwordHash,
      type: 'broker',
      creci: 'CRECI-12345',
      subscriptionActive: true,
    },
  });

  console.log('Seed: cliente e corretor criados', { client: client.email, broker: broker.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
