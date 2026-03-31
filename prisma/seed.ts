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

const mobilias = [
  { codigo: 'mobiliado', label: 'Mobiliado', ordem: 1 },
  { codigo: 'naomobiliado', label: 'Não mobiliado', ordem: 2 },
  { codigo: 'indiferente', label: 'Indiferente', ordem: 3 },
];

const features = [
  { codigo: 'piscina', label: 'Piscina', ordem: 1 },
  { codigo: 'churrasqueira', label: 'Churrasqueira', ordem: 2 },
  { codigo: 'academia', label: 'Academia', ordem: 3 },
  { codigo: 'areaverde', label: 'Área verde', ordem: 4 },
  { codigo: 'garagem', label: 'Garagem', ordem: 5 },
  { codigo: 'seguranca', label: 'Segurança 24h', ordem: 6 },
];

const planos = [
  { codigo: 'basico', label: 'Básico', ordem: 1 },
  { codigo: 'profissional', label: 'Profissional', ordem: 2 },
  { codigo: 'premium', label: 'Premium', ordem: 3 },
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
  for (const m of mobilias) {
    await prisma.mobilia.upsert({
      where: { codigo: m.codigo },
      update: { label: m.label, ordem: m.ordem },
      create: m,
    });
  }
  for (const f of features) {
    await prisma.feature.upsert({
      where: { codigo: f.codigo },
      update: { label: f.label, ordem: f.ordem },
      create: f,
    });
  }
  for (const p of planos) {
    await prisma.plano.upsert({
      where: { codigo: p.codigo },
      update: { label: p.label, ordem: p.ordem },
      create: p,
    });
  }
  console.log(
    'Seed: parâmetros (finalidade, tipoimovel, tipocasa, mobilia, feature, plano) criados/atualizados.',
  );
}

async function main() {
  await seedParametros();

  const senhahash = await bcrypt.hash('senha123', 10);

  const planoProfissional = await prisma.plano.findUnique({
    where: { codigo: 'profissional' },
  });

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
      planoid: planoProfissional?.id ?? undefined,
      ativoassinatura: true,
    },
  });

  console.log('Seed: cliente e corretor criados', {
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
