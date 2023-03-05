import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { Controller, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { QrcodeService } from './qrcode.service';
import { CreateQRCode, UseGym } from './qrcode.decorators';

@ApiTags('QRCODE')
@Controller('api/qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @CreateQRCode()
  @Post()
  async createQRcode(@CurrentUser() user: JwtPayload) {
    return await this.qrcodeService.createQRcode(user);
  }

  @UseGym()
  @Post('/:userId')
  async useGym(@Param('userId') userId: number, @CurrentUser() businessUser: JwtPayload) {
    return await this.qrcodeService.useGym(businessUser, userId);
  }
}
