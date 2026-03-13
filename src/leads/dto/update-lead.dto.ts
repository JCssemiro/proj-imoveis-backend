import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn, IsUUID } from 'class-validator';

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: ['new', 'contacted', 'in_progress', 'closed'] })
  @IsOptional()
  @IsIn(['new', 'contacted', 'in_progress', 'closed'])
  status?: 'new' | 'contacted' | 'in_progress' | 'closed';

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUUID()
  brokerId?: string | null;
}
