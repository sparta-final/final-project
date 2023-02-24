import { Module } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { AuthController } from './domain/auth/auth.controller';
import { AuthService } from './domain/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './global/config/ormConfig';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
