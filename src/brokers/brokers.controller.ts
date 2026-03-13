import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BrokersService } from './brokers.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Corretor')
@Controller('corretor')
export class BrokersController {
  constructor(private brokers: BrokersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar corretores (público)' })
  findAll() {
    return this.brokers.findAll();
  }
}
