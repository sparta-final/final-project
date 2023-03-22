import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { multerOptionsFactory } from 'src/global/common/utils/multer.options.factory';
import { UserGym } from 'src/global/entities/UserGym';
import { Users } from 'src/global/entities/Users';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserGym]),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
