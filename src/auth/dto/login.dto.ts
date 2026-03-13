import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(1, { message: 'Senha é obrigatória' })
  password: string;

  @ApiProperty({ enum: ['client', 'broker'] })
  @IsIn(['client', 'broker'], { message: 'type deve ser client ou broker' })
  type: 'client' | 'broker';
}
