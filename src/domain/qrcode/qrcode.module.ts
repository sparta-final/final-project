import { UserGym } from 'src/global/entities/UserGym';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QRcodeController } from './qrcode.controller';
import { QRcodeService } from './qrcode.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGym])],
  controllers: [QRcodeController],
  providers: [QRcodeService],
})
export class QrcodeModule {}
