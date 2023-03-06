import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { CreateQRCode, UseGym } from './qrcode.decorators';
import { QRcodeService } from './qrcode.service';

@ApiTags('QRCODE')
@Controller('api/qrcode')
export class QRcodeController {
  constructor(private readonly qrcodeService: QRcodeService) {}

  @CreateQRCode()
  @Post()
  async createQRcode(@CurrentUser() user: JwtPayload) {
    console.log('user', user);
    return await this.qrcodeService.createQRcode(user);
  }

  @UseGym()
  @Post('/:date/:userId')
  async useGym(@Param('date') date: number, @Param('userId') userId: number, @CurrentUser() businessUser: JwtPayload) {
    return await this.qrcodeService.useGym(businessUser, date, userId);
  }
}
