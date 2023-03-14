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
import { UserModule } from './domain/user/user.module';
import { BusinessUserModule } from './domain/business-user/business-user.module';
import { PaymentModule } from './domain/payment/payment.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { HttpModule } from '@nestjs/axios';
import { AdminModule } from './domain/admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      url: process.env.REDIS_URL,
      store: redisStore,
    }),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 999,
    }),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 999,
    }),
    AuthModule,
    GymModule,
    ReviewModule,
    QrcodeModule,
    FeedModule,
    FeedModule,
    UserModule,
    BusinessUserModule,
    PaymentModule,
    // HttpModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
