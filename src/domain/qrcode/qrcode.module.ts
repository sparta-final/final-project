import { UserGym } from 'src/global/entities/UserGym';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { QrcodeController } from './qrcode.controller';
import { Gym } from 'src/global/entities/Gym';

@Module({
  imports: [TypeOrmModule.forFeature([UserGym, Gym])],
  controllers: [QrcodeController],
  providers: [QrcodeService],
})
export class QrcodeModule {}
