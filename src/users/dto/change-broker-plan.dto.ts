import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ChangeBrokerPlanDto {
  @ApiProperty({ description: 'UUID do plano (GET /api/v1/parametros/plano)', example: 'uuid' })
  @IsUUID('4')
  planoId: string;
}

