-- ImobiConnect — UUID nas entidades; parâmetros com codigo int; status lead smallint ordenado; monetário NUMERIC; textos com VARCHAR limitado

create extension if not exists pgcrypto;

create type tipousuario as enum ('client', 'broker');
create type tiporemetente as enum ('client', 'broker');

create table finalidadeuso (
  codigo integer primary key,
  nome varchar(120) not null,
  ativo boolean not null default true
);

create table finalidadecontratacao (
  codigo integer primary key,
  nome varchar(120) not null,
  ativo boolean not null default true
);

create table tipoimovel (
  codigo integer primary key,
  nome varchar(120) not null,
  finalidadeusocodigo integer not null references finalidadeuso(codigo) on delete restrict on update cascade,
  ativo boolean not null default true
);

create index tipoimovelfinalidadeusocodigo_idx on tipoimovel(finalidadeusocodigo);
create index tipoimovelativo_idx on tipoimovel(ativo);

create table mobilia (
  codigo integer primary key,
  nome varchar(120) not null,
  ativo boolean not null default true
);

create table urgencia (
  codigo integer primary key,
  nome varchar(120) not null,
  ativo boolean not null default true
);

create index finalidadeuso_ativo_idx on finalidadeuso(ativo);
create index finalidadecontratacao_ativo_idx on finalidadecontratacao(ativo);
create index mobilia_ativo_idx on mobilia(ativo);
create index urgencia_ativo_idx on urgencia(ativo);

create table plano (
  codigo integer primary key,
  nome varchar(120) not null,
  precomensal numeric(14, 2) not null default 0,
  ativo boolean not null default true
);

create index plano_ativo_idx on plano(ativo);

create table usuario (
  id uuid not null primary key default gen_random_uuid(),
  nome varchar(200) not null,
  email varchar(320) not null,
  telefone varchar(30) not null,
  senhahash varchar(255) not null,
  tipo tipousuario not null,
  creci varchar(30),
  planocodigo integer references plano(codigo) on delete set null on update cascade,
  ativoassinatura boolean,
  avatar varchar(2048),
  tokenresetarsenha varchar(128),
  expiraresetarsenha timestamp(3),
  criadoem timestamp(3) not null default current_timestamp,
  atualizadoem timestamp(3) not null default current_timestamp
);

create unique index usuarioemailkey on usuario(email);
create unique index usuario_creci_key on usuario(creci) where creci is not null;
create index usuariotipoidx on usuario(tipo);
create index usuarioplanocodigo_idx on usuario(planocodigo);

create table interesseimovel (
  id uuid not null primary key default gen_random_uuid(),
  clientid uuid not null references usuario(id) on delete cascade on update cascade,
  finalidadecontratacaocodigo integer not null references finalidadecontratacao(codigo) on delete restrict on update cascade,
  finalidadeusocodigo integer not null references finalidadeuso(codigo) on delete restrict on update cascade,
  tipoimovelcodigo integer not null references tipoimovel(codigo) on delete restrict on update cascade,
  mobiliacodigo integer not null references mobilia(codigo) on delete restrict on update cascade,
  urgenciacodigo integer not null references urgencia(codigo) on delete restrict on update cascade,
  aceitafinanciamento boolean not null default false,
  quartos integer[] not null default '{}',
  suites integer[] not null default '{}',
  metragem integer,
  minprice numeric(14, 2) not null default 0,
  maxprice numeric(14, 2) not null default 0,
  observacoes varchar(5000) not null default '',
  status smallint not null default 1,
  ativo boolean not null default true,
  criadoem timestamp(3) not null default current_timestamp,
  constraint interesseimovelpricerange check (minprice <= maxprice),
  constraint interesseimovelmetragemnonnegative check (metragem is null or metragem >= 0),
  constraint interesseimovelstatusrange check (status >= 1 and status <= 4)
);

create index interesseimovelclientididx on interesseimovel(clientid);
create index interesseimovelcriadoemidx on interesseimovel(criadoem);
create index interesseimovelativoidx on interesseimovel(ativo);
create index interesseimovelclientidativoidx on interesseimovel(clientid, ativo);
create index interesseimoveltipoimovelcodigo_idx on interesseimovel(tipoimovelcodigo);
create index interesseimovelminmaxpriceidx on interesseimovel(minprice, maxprice);
create index interesseimovelfinalidadecontratacaocodigo_idx on interesseimovel(finalidadecontratacaocodigo);
create index interesseimovelfinalidadeusocodigo_idx on interesseimovel(finalidadeusocodigo);
create index interesseimovelstatusidx on interesseimovel(status);

create table localizacaointeresse (
  id uuid not null primary key default gen_random_uuid(),
  interesseimovelid uuid not null references interesseimovel(id) on delete cascade on update cascade,
  cep varchar(12),
  logradouro varchar(255),
  bairro varchar(120),
  cidade varchar(120),
  uf char(2),
  codibgecidade varchar(10)
);

create index localizacaointeresseinteresseimovelididx on localizacaointeresse(interesseimovelid);
create index localizacaointeressecepidx on localizacaointeresse(cep);
create index localizacaointeressecodibgeidx on localizacaointeresse(codibgecidade);

create table conversa (
  id uuid not null primary key default gen_random_uuid(),
  clientid uuid not null references usuario(id) on delete cascade on update cascade,
  corretorid uuid not null references usuario(id) on delete cascade on update cascade,
  interesseimovelid uuid not null references interesseimovel(id) on delete cascade on update cascade,
  resumointeresse varchar(512) not null,
  ativo boolean not null default true,
  atualizadoem timestamp(3) not null default current_timestamp
);

create index conversaclientididx on conversa(clientid);
create index conversacorretorididx on conversa(corretorid);
create index conversa_interesseimovelid_ativo_idx on conversa(interesseimovelid, ativo);
create index conversa_corretorid_ativo_idx on conversa(corretorid, ativo);
create index conversaatualizadoemidx on conversa(atualizadoem);

create table mensagem (
  id uuid not null primary key default gen_random_uuid(),
  conversaid uuid not null references conversa(id) on delete cascade on update cascade,
  remetenteid uuid not null references usuario(id) on delete cascade on update cascade,
  tiporemetente tiporemetente not null,
  conteudo varchar(4000) not null,
  urlimagem varchar(2048),
  criadoem timestamp(3) not null default current_timestamp
);

create index mensagemconversaididx on mensagem(conversaid);
create index mensagemcriadoemidx on mensagem(criadoem);
create index mensagemconversaidcriadoemidx on mensagem(conversaid, criadoem);

-- Seed (precomensal em reais com 2 decimais)
insert into finalidadeuso (codigo, nome) values
  (1, 'Residencial'),
  (2, 'Comercial');

insert into finalidadecontratacao (codigo, nome) values
  (1, 'Compra'),
  (2, 'Aluguel');

insert into tipoimovel (codigo, nome, finalidadeusocodigo) values
  (1, 'Apartamento', 1),
  (2, 'Casa em Condomínio', 1),
  (3, 'Casa em Via Pública', 1),
  (4, 'Sobrado', 1),
  (5, 'Terreno em Condomínio', 1),
  (6, 'Terreno em Via Pública', 1),
  (7, 'Galpão', 2),
  (8, 'Terreno em Via Pública', 2),
  (9, 'Terreno em Condomínio', 2),
  (10, 'Outro', 2);

insert into mobilia (codigo, nome) values
  (1, '100% Mobiliado'),
  (2, 'Somente Planejados'),
  (3, 'Sem Mobília');

insert into urgencia (codigo, nome) values
  (1, 'Imediato'),
  (2, 'Até 3 meses'),
  (3, 'Até 6 meses'),
  (4, 'Até 1 ano'),
  (5, 'Só pesquisando');

insert into plano (codigo, nome, precomensal) values
  (1, 'Básico', 99.00),
  (2, 'Profissional', 299.00),
  (3, 'Premium', 599.00);
