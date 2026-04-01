import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ChangeBrokerPlanDto {
  @ApiProperty({
    description: 'Código do plano retornado por GET /parametros/plano',
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  planoCodigo: number;
}
