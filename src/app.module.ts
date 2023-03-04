import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './global/config/ormConfig';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './domain/auth/guard/jwt-access.guard';
import { AppController } from './app.controller';
import { PaymentModule } from './domain/payment/payment.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
      store: redisStore,
    }),
    AuthModule,
    PaymentModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
