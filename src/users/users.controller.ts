import { Controller, Get, Patch, Body, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
  @ApiOperation({ summary: 'Perfil do usuário autenticado' })
  getMe(@CurrentUser('sub') userId: string) {
    return this.users.getMe(userId);
  }

  @Patch('eu')
  @ApiOperation({ summary: 'Atualizar perfil' })
  updateMe(@CurrentUser('sub') userId: string, @Body() dto: UpdateProfileDto) {
    return this.users.updateMe(userId, dto);
  }

  @Patch('plano')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('broker')
  @ApiOperation({ summary: 'Alterar plano do corretor' })
  changeBrokerPlan(
    @CurrentUser('sub') brokerId: string,
    @Body() dto: ChangeBrokerPlanDto,
  ) {
    return this.users.changeBrokerPlan(brokerId, dto.planoId);
  }
}
