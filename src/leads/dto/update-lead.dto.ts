import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateLeadDto {
  @ApiPropertyOptional({
    description: 'Status numérico: 1=novo, 2=contatado, 3=em andamento, 4=encerrado',
    minimum: 1,
    maximum: 4,
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  status?: number;
}
