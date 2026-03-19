-- =============================================================================
-- ImobiConnect - Schema padronizado: PT lowercase, enum compraoualuguel,
-- feature/localizacao parametrizados, plano corretores
-- =============================================================================

-- Enums
create type tipousuario as enum ('client', 'broker');
create type statuslead as enum ('new', 'contacted', 'in_progress', 'closed');
create type tiporemetente as enum ('client', 'broker');
create type compraoualuguel as enum ('compra', 'aluguel');

-- =============================================================================
-- Tabelas de parâmetros (cadastro sem alterar schema)
-- =============================================================================

create table finalidade (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint finalidadepkey primary key (id)
);

create table tipoimovel (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint tipoimovelpkey primary key (id)
);

create table tipocasa (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint tipocasapkey primary key (id)
);

create table mobilia (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint mobiliapkey primary key (id)
);

-- Features pré-cadastradas (características de imóvel)
create table feature (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint featurepkey primary key (id)
);

-- Planos dos corretores
create table plano (
  id text not null,
  codigo text not null,
  label text not null,
  ativo boolean not null default true,
  ordem integer not null default 0,
  criadoem timestamp(3) not null default current_timestamp,
  constraint planopkey primary key (id)
);

create unique index finalidadecodigokey on finalidade(codigo);
create unique index tipoimovelcodigokey on tipoimovel(codigo);
create unique index tipocasacodigokey on tipocasa(codigo);
create unique index mobiliacodigokey on mobilia(codigo);
create unique index featurecodigokey on feature(codigo);
create unique index planocodigokey on plano(codigo);

create index finalidadeativoordemidx on finalidade(ativo, ordem);
create index tipoimovelativoordemidx on tipoimovel(ativo, ordem);
create index tipocasaativoordemidx on tipocasa(ativo, ordem);
create index mobiliaativoordemidx on mobilia(ativo, ordem);
create index featureativoordemidx on feature(ativo, ordem);
create index planoativoordemidx on plano(ativo, ordem);

-- =============================================================================
-- usuario
-- =============================================================================

create table usuario (
  id text not null,
  nome text not null,
  email text not null,
  telefone text not null,
  senhahash text not null,
  tipo tipousuario not null,
  cpf text,
  creci text,
  planoid text,
  ativoassinatura boolean,
  avatar text,
  tokenresetarsenha text,
  expiraresetarsenha timestamp(3),
  criadoem timestamp(3) not null default current_timestamp,
  atualizadoem timestamp(3) not null default current_timestamp,
  constraint usuariopkey primary key (id)
);

create unique index usuarioemailkey on usuario(email);
create index usuariotipoidx on usuario(tipo);
create index usuarioplanoididx on usuario(planoid);

-- =============================================================================
-- interesseimovel
-- =============================================================================

create table interesseimovel (
  id text not null,
  clientid text not null,
  compraoualuguel compraoualuguel not null,
  finalidadeid text not null,
  tipoimovelid text not null,
  tipocasaid text not null,
  mobiliaid text not null,
  quartos integer,
  suites integer,
  metragemterreno integer,
  areaconstruida integer,
  minprice integer not null default 0,
  maxprice integer not null default 0,
  observacoes text not null default '',
  ativo boolean not null default true,
  criadoem timestamp(3) not null default current_timestamp,
  constraint interesseimovelpkey primary key (id),
  constraint interesseimovelobservacoeslength check (length(observacoes) <= 5000),
  constraint interesseimovelminpricenonnegative check (minprice >= 0),
  constraint interesseimovelmaxpricenonnegative check (maxprice >= 0),
  constraint interesseimovelpricerange check (minprice <= maxprice),
  constraint interesseimovelquartosnonnegative check (quartos is null or quartos >= 0),
  constraint interesseimovelsuitesnonnegative check (suites is null or suites >= 0),
  constraint interesseimovelmetragemnonnegative check (metragemterreno is null or metragemterreno >= 0),
  constraint interesseimovelareanonnegative check (areaconstruida is null or areaconstruida >= 0)
);

create index interesseimovelclientididx on interesseimovel(clientid);
create index interesseimovelcriadoemidx on interesseimovel(criadoem);
create index interesseimovelativoidx on interesseimovel(ativo);
create index interesseimovelclientidativoidx on interesseimovel(clientid, ativo);
create index interesseimovelclientidativocriadoemidx on interesseimovel(clientid, ativo, criadoem desc nulls last);
create index interesseimovelfinalidadeidtipoimovelididx on interesseimovel(finalidadeid, tipoimovelid);
create index interesseimovelminpricemaxpriceidx on interesseimovel(minprice, maxprice);
create index interesseimovelcompraoualuguelidx on interesseimovel(compraoualuguel);

-- =============================================================================
-- localizacaointeresse (CEP, municipio cod IBGE, bairro - todos opcionais)
-- =============================================================================

create table localizacaointeresse (
  id text not null default gen_random_uuid()::text,
  interesseimovelid text not null,
  cep text,
  municipiocodibge text,
  bairro text,
  constraint localizacaointeressepkey primary key (id)
);

create index localizacaointeresseinteresseimovelididx on localizacaointeresse(interesseimovelid);
create index localizacaointeressecepidx on localizacaointeresse(cep) where cep is not null;
create index localizacaointeressemunicipiocodibgeidx on localizacaointeresse(municipiocodibge) where municipiocodibge is not null;

-- =============================================================================
-- interesseimovelfeature (N:N interesse <-> feature)
-- =============================================================================

create table interesseimovelfeature (
  interesseimovelid text not null,
  featureid text not null,
  constraint interesseimovelfeaturepkey primary key (interesseimovelid, featureid)
);

create index interesseimovelfeatureinteresseimovelididx on interesseimovelfeature(interesseimovelid);
create index interesseimovelfeaturefeatureididx on interesseimovelfeature(featureid);

-- =============================================================================
-- prospecto (lead)
-- =============================================================================

create table prospecto (
  id text not null,
  interesseimovelid text not null,
  corretorid text,
  status statuslead not null default 'new',
  criadoem timestamp(3) not null default current_timestamp,
  constraint prospectopkey primary key (id)
);

create unique index prospectointeresseimovelidkey on prospecto(interesseimovelid);
create index prospectocorretorididx on prospecto(corretorid);
create index prospectostatusidx on prospecto(status);
create index prospectocriadoemidx on prospecto(criadoem);
create index prospectocorretoridstatusidx on prospecto(corretorid, status);
create index prospectostatusnewidx on prospecto(status) where status = 'new';

-- =============================================================================
-- conversa
-- =============================================================================

create table conversa (
  id text not null,
  clientid text not null,
  corretorid text not null,
  leadid text not null,
  resumointeresse text not null,
  atualizadoem timestamp(3) not null default current_timestamp,
  constraint conversapkey primary key (id)
);

create unique index conversaleadidkey on conversa(leadid);
create index conversaclientididx on conversa(clientid);
create index conversacorretorididx on conversa(corretorid);
create index conversaatualizadoemidx on conversa(atualizadoem);

-- =============================================================================
-- mensagem
-- =============================================================================

create table mensagem (
  id text not null,
  conversaid text not null,
  remetenteid text not null,
  tiporemetente tiporemetente not null,
  conteudo text not null,
  urlimagem text,
  criadoem timestamp(3) not null default current_timestamp,
  constraint mensagempkey primary key (id)
);

create index mensagemconversaididx on mensagem(conversaid);
create index mensagemcriadoemidx on mensagem(criadoem);
create index mensagemconversaidcriadoemidx on mensagem(conversaid, criadoem);

-- =============================================================================
-- Foreign keys
-- =============================================================================

alter table usuario add constraint usuarioplanoidfkey foreign key (planoid) references plano(id) on delete set null on update cascade;

alter table interesseimovel add constraint interesseimovelclientidfkey foreign key (clientid) references usuario(id) on delete cascade on update cascade;
alter table interesseimovel add constraint interesseimovelfinalidadeidfkey foreign key (finalidadeid) references finalidade(id) on delete restrict on update cascade;
alter table interesseimovel add constraint interesseimoveltipoimovelidfkey foreign key (tipoimovelid) references tipoimovel(id) on delete restrict on update cascade;
alter table interesseimovel add constraint interesseimoveltipocasaidfkey foreign key (tipocasaid) references tipocasa(id) on delete restrict on update cascade;
alter table interesseimovel add constraint interesseimovelmobiliaidfkey foreign key (mobiliaid) references mobilia(id) on delete restrict on update cascade;

alter table localizacaointeresse add constraint localizacaointeresseinteresseimovelidfkey foreign key (interesseimovelid) references interesseimovel(id) on delete cascade on update cascade;

alter table interesseimovelfeature add constraint interesseimovelfeatureinteresseimovelidfkey foreign key (interesseimovelid) references interesseimovel(id) on delete cascade on update cascade;
alter table interesseimovelfeature add constraint interesseimovelfeaturefeatureidfkey foreign key (featureid) references feature(id) on delete restrict on update cascade;

alter table prospecto add constraint prospectointeresseimovelidfkey foreign key (interesseimovelid) references interesseimovel(id) on delete cascade on update cascade;
alter table prospecto add constraint prospectocorretoridfkey foreign key (corretorid) references usuario(id) on delete set null on update cascade;

alter table conversa add constraint conversaclientidfkey foreign key (clientid) references usuario(id) on delete cascade on update cascade;
alter table conversa add constraint conversacorretoridfkey foreign key (corretorid) references usuario(id) on delete cascade on update cascade;
alter table conversa add constraint conversaleadidfkey foreign key (leadid) references prospecto(id) on delete cascade on update cascade;

alter table mensagem add constraint mensagemconversaidfkey foreign key (conversaid) references conversa(id) on delete cascade on update cascade;
alter table mensagem add constraint mensagemremetenteidfkey foreign key (remetenteid) references usuario(id) on delete cascade on update cascade;
