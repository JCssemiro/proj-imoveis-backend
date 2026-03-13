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
  @ApiOperation({ summary: 'Listar leads do corretor' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'tipoImovel', required: false })
  @ApiQuery({ name: 'regiao', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  findAll(
    @CurrentUser('sub') _brokerId: string,
    @Query('status') status?: string,
    @Query('tipoImovel') tipoImovel?: string,
    @Query('regiao') regiao?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.leads.findAll(_brokerId, {
      status,
      tipoImovel,
      regiao,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    });
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
