import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ParametrosService } from './parametros.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Parâmetros')
@Public()
@Controller('parametros')
export class ParametrosController {
  constructor(private parametros: ParametrosService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os parâmetros',
    description:
      'Cada parâmetro usa `codigo` (inteiro) como chave. No interesse envie: finalidadeContratacaoCodigo, finalidadeUsoCodigo, tipoImovelCodigo, mobiliaCodigo, urgenciaCodigo, aceitaFinanciamento (boolean), quartos e suites (arrays de inteiros, ex.: quantidades aceitas).',
  })
  async getAll() {
    return this.parametros.getAll();
  }

  @Get('finalidadeuso')
  @ApiOperation({ summary: 'Finalidade de uso (Residencial / Comercial)' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getFinalidadeUso(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getFinalidadeUsoPaginado({ pagina, tamanho });
  }

  @Get('finalidadecontratacao')
  @ApiOperation({ summary: 'Compra ou Aluguel' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getFinalidadeContratacao(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getFinalidadeContratacaoPaginado({ pagina, tamanho });
  }

  @Get('tipoimovel')
  @ApiOperation({
    summary: 'Tipos de imóvel',
    description: 'Inclui finalidadeUsoCodigo do grupo.',
  })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getTiposImovel(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getTiposImovelPaginado({ pagina, tamanho });
  }

  @Get('mobilia')
  @ApiOperation({ summary: 'Mobília' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getMobilias(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getMobiliasPaginado({ pagina, tamanho });
  }

  @Get('urgencia')
  @ApiOperation({ summary: 'Urgência' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getUrgencia(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getUrgenciaPaginado({ pagina, tamanho });
  }

  @Get('plano')
  @ApiOperation({
    summary: 'Planos de corretores',
    description: 'precoMensal em reais. PATCH /usuario/plano envia planoCodigo.',
  })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  getPlanos(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.parametros.getPlanosPaginado({ pagina, tamanho });
  }
}
