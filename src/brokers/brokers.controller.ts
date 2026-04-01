import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BrokersService } from './brokers.service';

@ApiTags('Corretor')
@ApiBearerAuth('access-token')
@Controller('corretor')
export class BrokersController {
  constructor(private brokers: BrokersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar corretores (paginado; requer autenticação)' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  findAll(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.brokers.findAll({ pagina, tamanho });
  }
}
