import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'UUID do interesse (lead) — mesmo id retornado em GET /interesse e /prospecto' })
  @IsUUID('4')
  interesseImovelId: string;

  @ApiProperty()
  @IsUUID('4')
  clientId: string;

  @ApiProperty()
  @IsUUID('4')
  brokerId: string;
}
