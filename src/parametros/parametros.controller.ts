import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ParametrosService, ParametroItem } from './parametros.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Parâmetros')
@Controller('parametros')
@Public()
export class ParametrosController {
  constructor(private parametros: ParametrosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os parâmetros',
    description:
      'Retorna todos os parâmetros em uma chamada. Nos payloads de interesse use o campo "id" (UUID) para finalidadeId, tipoImovelId, tipoCasaId, mobiliaId e featureIds. compraOuAluguel usa "valor" (compra|aluguel).',
  })
  async getAll() {
    return this.parametros.getAll();
  }

  @Get('finalidade')
  @ApiOperation({
    summary: 'Listar finalidades',
    description: 'Parâmetros para finalidadeId no cadastro de interesse. Enviar o "id" (UUID) no body.',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getFinalidades(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getFinalidadesPaginado({ pagina, tamanho });
  }

  @Get('tipoimovel')
  @ApiOperation({
    summary: 'Listar tipos de imóvel',
    description: 'Parâmetros para tipoImovelId no cadastro de interesse e query tipoImovelId no filtro de leads. Enviar o "id" (UUID).',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getTiposImovel(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getTiposImovelPaginado({ pagina, tamanho });
  }

  @Get('tipocasa')
  @ApiOperation({
    summary: 'Listar tipos de casa',
    description: 'Parâmetros para tipoCasaId no cadastro de interesse. Enviar o "id" (UUID).',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getTiposCasa(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getTiposCasaPaginado({ pagina, tamanho });
  }

  @Get('mobilia')
  @ApiOperation({
    summary: 'Listar opções de mobília',
    description: 'Parâmetros para mobiliaId no cadastro de interesse. Enviar o "id" (UUID).',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getMobilias(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getMobiliasPaginado({ pagina, tamanho });
  }

  @Get('feature')
  @ApiOperation({
    summary: 'Listar features (características)',
    description: 'Parâmetros para featureIds (array de UUID) no cadastro de interesse. Enviar os "id" no array.',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getFeatures(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getFeaturesPaginado({ pagina, tamanho });
  }

  @Get('plano')
  @ApiOperation({
    summary: 'Listar planos de corretores',
    description: 'Parâmetros para planoid no cadastro de corretor. Enviar o "id" (UUID) do plano.',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  async getPlanos(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getPlanosPaginado({ pagina, tamanho });
  }

  @Get('compraoualuguel')
  @ApiOperation({
    summary: 'Listar opções compra/aluguel',
    description: 'Valores fixos para compraOuAluguel no cadastro de interesse. Enviar o "valor" (compra ou aluguel).',
  })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  getCompraOuAluguel(
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.parametros.getCompraOuAluguelPaginado({ pagina, tamanho });
  }
}
