import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BrokersService } from './brokers.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Corretor')
@Controller('corretor')
export class BrokersController {
  constructor(private brokers: BrokersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar corretores (público, paginado)' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  findAll(@Query('pagina') pagina?: string, @Query('tamanho') tamanho?: string) {
    return this.brokers.findAll({ pagina, tamanho });
  }
}
