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
import { UserModule } from './domain/user/user.module';
import { BusinessUserModule } from './domain/business-user/business-user.module';
import { Users } from './global/entities/Users';
import { UserService } from './domain/user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    TypeOrmModule.forFeature([Users]),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
      store: redisStore,
    }),
    AuthModule,
    GymModule,
    ReviewModule,
    QrcodeModule,
    UserModule,
    BusinessUserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    UserService,
  ],
})
export class AppModule {}
