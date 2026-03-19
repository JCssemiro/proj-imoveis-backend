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
    summary: 'Listar leads do corretor (paginado)',
    description:
      'Filtros por interesse e data. Use IDs de GET /parametros para tipoImovelId, finalidadeId, tipoCasaId, mobiliaId. status: new | contacted | in_progress | closed. dataInicio/dataFim: ISO 8601.',
  })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'tipoImovelId', required: false })
  @ApiQuery({ name: 'finalidadeId', required: false })
  @ApiQuery({ name: 'tipoCasaId', required: false })
  @ApiQuery({ name: 'mobiliaId', required: false })
  @ApiQuery({ name: 'compraOuAluguel', required: false, enum: ['compra', 'aluguel'] })
  @ApiQuery({ name: 'regiao', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'dataInicio', required: false, description: 'Data mínima criação do lead (ISO 8601)' })
  @ApiQuery({ name: 'dataFim', required: false, description: 'Data máxima criação do lead (ISO 8601)' })
  findAll(
    @CurrentUser('sub') _brokerId: string,
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
    @Query('status') status?: string,
    @Query('tipoImovelId') tipoImovelId?: string,
    @Query('finalidadeId') finalidadeId?: string,
    @Query('tipoCasaId') tipoCasaId?: string,
    @Query('mobiliaId') mobiliaId?: string,
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
        tipoImovelId,
        finalidadeId,
        tipoCasaId,
        mobiliaId,
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
  @ApiOperation({ summary: 'Buscar lead por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.leads.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar status do lead' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser('sub') brokerId: string,
  ) {
    return this.leads.update(id, dto, brokerId);
  }
}
