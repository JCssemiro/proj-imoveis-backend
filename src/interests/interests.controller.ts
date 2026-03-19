import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InterestsService } from './interests.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Interesse')
@ApiBearerAuth('access-token')
@Controller('interesse')
@UseGuards(RolesGuard)
@Roles('client')
export class InterestsController {
  constructor(private interests: InterestsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar interesses do cliente (paginado)' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filtrar por ativo (true/false)' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Página (padrão: 1)' })
  @ApiQuery({ name: 'tamanho', required: false, description: 'Itens por página (padrão: 20)' })
  findAll(
    @CurrentUser('sub') clientId: string,
    @Query('isActive') isActive?: string,
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    const active =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.interests.findAll(clientId, active, { pagina, tamanho });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar interesse por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('sub') clientId: string) {
    return this.interests.findOne(id, clientId);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar interesse de imóvel',
    description:
      'Envie IDs (UUID) retornados por GET /parametros: finalidadeId, tipoImovelId, tipoCasaId (opcional), mobiliaId (opcional), featureIds (array). compraOuAluguel: "compra" ou "aluguel".',
  })
  create(@CurrentUser('sub') clientId: string, @Body() dto: CreateInterestDto) {
    return this.interests.create(clientId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar interesse' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') clientId: string,
    @Body() dto: UpdateInterestDto,
  ) {
    return this.interests.update(id, clientId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover interesse' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('sub') clientId: string) {
    return this.interests.remove(id, clientId);
  }
}
