import { UserGym } from 'src/global/entities/UserGym';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Gym } from 'src/global/entities/Gym';
import { QRcodeController } from './qrcode.controller';
import { QRcodeService } from './qrcode.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGym, Gym])],
  controllers: [QRcodeController],
  providers: [QRcodeService],
})
export class QrcodeModule {}
