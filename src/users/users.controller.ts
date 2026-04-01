import { Controller, Get, Patch, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ChangeBrokerPlanDto } from './dto/change-broker-plan.dto';

@ApiTags('Usuário')
@ApiBearerAuth('access-token')
@Controller('usuario')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('eu')
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiOperation({
    summary: 'Perfil do usuário autenticado',
    description:
      'Retorna `plan` (codigo, nome, precoMensal) para corretores com plano vinculado; clientes e corretores sem plano recebem `plan: null`.',
  })
  getMe(@CurrentUser('sub') userId: string) {
    return this.users.getMe(userId);
  }

  @Patch('eu')
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiOperation({ summary: 'Atualizar perfil' })
  updateMe(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(userId, dto);
  }

  @Patch('plano')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('broker')
  @ApiOkResponse({ type: UserProfileResponseDto })
  @ApiOperation({ summary: 'Alterar plano do corretor' })
  changeBrokerPlan(
    @CurrentUser('sub') brokerId: string,
    @Body() dto: ChangeBrokerPlanDto,
  ) {
    return this.users.changeBrokerPlan(brokerId, Number(dto.planoCodigo));
  }
}
