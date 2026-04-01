import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Prospecto')
@ApiBearerAuth('access-token')
@Controller('prospecto')
@UseGuards(RolesGuard)
@Roles('broker')
export class LeadsController {
  constructor(private leads: LeadsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar leads (interesses) paginado',
    description:
      'O id do lead é o UUID do interesse. Filtro status: 1–4 (1=novo … 4=encerrado); sem status, exclui encerrados. Demais filtros: códigos de GET /parametros. compraOuAluguel: compra|aluguel.',
  })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  @ApiQuery({ name: 'status', required: false, description: '1–4 (opcional; padrão lista sem status 4)' })
  @ApiQuery({ name: 'tipoImovelCodigo', required: false })
  @ApiQuery({ name: 'finalidadeContratacaoCodigo', required: false })
  @ApiQuery({ name: 'finalidadeUsoCodigo', required: false })
  @ApiQuery({ name: 'mobiliaCodigo', required: false })
  @ApiQuery({ name: 'compraOuAluguel', required: false, enum: ['compra', 'aluguel'] })
  @ApiQuery({ name: 'regiao', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'dataInicio', required: false, description: 'ISO 8601' })
  @ApiQuery({ name: 'dataFim', required: false, description: 'ISO 8601' })
  findAll(
    @CurrentUser('sub') _brokerId: string,
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
    @Query('status') status?: string,
    @Query('tipoImovelCodigo') tipoImovelCodigo?: string,
    @Query('finalidadeContratacaoCodigo') finalidadeContratacaoCodigo?: string,
    @Query('finalidadeUsoCodigo') finalidadeUsoCodigo?: string,
    @Query('mobiliaCodigo') mobiliaCodigo?: string,
    @Query('compraOuAluguel') compraOuAluguel?: string,
    @Query('regiao') regiao?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    return this.leads.findAll(
      _brokerId,
      {
        status,
        tipoImovelCodigo,
        finalidadeContratacaoCodigo,
        finalidadeUsoCodigo,
        mobiliaCodigo,
        compraOuAluguel,
        regiao,
        minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
        dataInicio,
        dataFim,
      },
      { pagina, tamanho },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar lead (interesse) por UUID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('sub') _brokerId: string) {
    return this.leads.findOne(id, _brokerId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status do lead (1–4)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser('sub') _brokerId: string,
  ) {
    return this.leads.update(id, dto, _brokerId);
  }
}
