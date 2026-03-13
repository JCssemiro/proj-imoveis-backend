import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { SwaggerDocsController } from './swagger-docs.controller';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterestsModule } from './interests/interests.module';
import { LeadsModule } from './leads/leads.module';
import { ConversationsModule } from './conversations/conversations.module';
import { BrokersModule } from './brokers/brokers.module';

@Module({
  controllers: [AppController, SwaggerDocsController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    InterestsModule,
    LeadsModule,
    ConversationsModule,
    BrokersModule,
  ],
})
export class AppModule {}
