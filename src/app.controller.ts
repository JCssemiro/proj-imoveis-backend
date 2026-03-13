import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Saúde')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Status da API' })
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
