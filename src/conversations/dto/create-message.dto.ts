import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Conteúdo da mensagem não pode ser vazio' })
  content: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string | null;
}
