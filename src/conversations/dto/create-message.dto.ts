import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ maxLength: 4000 })
  @IsString()
  @MinLength(1, { message: 'Conteúdo da mensagem não pode ser vazio' })
  @MaxLength(4000)
  content: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 2048 })
  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(2048)
  imageUrl?: string | null;
}
