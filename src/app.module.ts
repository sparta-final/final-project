import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './global/config/ormConfig';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './domain/auth/guard/jwt-access.guard';
import { GymModule } from './domain/gym/gym.module';
import { ReviewModule } from './domain/review/review.module';
import { AppController } from './app.controller';
import { QrcodeModule } from './domain/qrcode/qrcode.module';
import { FeedModule } from './domain/feed/feed.module';

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
    GymModule,
    ReviewModule,
    QrcodeModule,
    FeedModule,
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
