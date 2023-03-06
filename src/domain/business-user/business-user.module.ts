import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Busienssusers } from 'src/global/entities/Busienssusers';
import { multerOptionsFactory } from 'src/global/util/multer.ontions';
import { BusinessUserController } from './business-user.controller';
import { BusinessUserService } from './business-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Busienssusers]),
    MulterModule.registerAsync({
      useFactory: multerOptionsFactory,
    }),
  ],
  controllers: [BusinessUserController],
  providers: [BusinessUserService],
})
export class BusinessUserModule {}
