import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

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
}
