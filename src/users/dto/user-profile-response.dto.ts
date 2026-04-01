import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserPlanResponseDto {
  @ApiProperty({ description: 'Código do plano (GET /parametros/plano)' })
  codigo: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({ description: 'Valor mensal em reais' })
  precoMensal: number;
}

export class UserProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: ['client', 'broker'] })
  type: string;

  @ApiPropertyOptional({ nullable: true })
  avatar: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'Somente corretores' })
  creci: string | null;

  @ApiPropertyOptional({ nullable: true, description: 'Somente corretores' })
  subscriptionActive: boolean | null;

  @ApiPropertyOptional({
    type: UserPlanResponseDto,
    nullable: true,
    description:
      'Dados do plano quando o usuário é corretor e possui planocodigo; para clientes ou sem plano: null',
  })
  plan: UserPlanResponseDto | null;
}
