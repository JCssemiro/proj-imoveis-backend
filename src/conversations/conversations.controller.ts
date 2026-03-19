import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Conversa')
@ApiBearerAuth('access-token')
@Controller('conversa')
export class ConversationsController {
  constructor(private conversations: ConversationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar conversas do usuário (paginado)' })
  @ApiQuery({ name: 'pagina', required: false })
  @ApiQuery({ name: 'tamanho', required: false })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('pagina') pagina?: string,
    @Query('tamanho') tamanho?: string,
  ) {
    return this.conversations.findAll(user.sub, user.type, { pagina, tamanho });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conversa por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.conversations.findOne(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('broker')
  @ApiOperation({ summary: 'Criar conversa (corretor)' })
  create(
    @Body() dto: CreateConversationDto,
    @CurrentUser('sub') brokerId: string,
  ) {
    return this.conversations.create(dto, brokerId);
  }

  @Post(':id/mensagem')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensagem na conversa' })
  createMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateMessageDto,
  ) {
    return this.conversations.createMessage(id, user, dto);
  }

  @Patch(':id/encerrar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Roles('client')
  @ApiOperation({ summary: 'Encerrar chat (somente cliente)' })
  encerrar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') clientId: string,
  ) {
    return this.conversations.encerrar(id, clientId);
  }
}
