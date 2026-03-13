import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';

export class RegisterClientDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({ example: 'cliente@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Telefone é obrigatório' })
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'CPF é obrigatório' })
  cpf: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({ enum: ['client'] })
  @IsIn(['client'])
  type: 'client';
}

export class RegisterBrokerDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({ example: 'corretor@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(1, { message: 'Telefone é obrigatório' })
  phone: string;

  @ApiProperty({ description: 'CRECI do corretor' })
  @IsString()
  @MinLength(1, { message: 'CRECI é obrigatório' })
  creci: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({ enum: ['broker'] })
  @IsIn(['broker'])
  type: 'broker';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  subscriptionActive?: boolean;
}

export type RegisterDto = RegisterClientDto | RegisterBrokerDto;
