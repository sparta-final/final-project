import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/auth/types/jwtPayload.type';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { CreateQRCode, GetUseHistory, UseGym } from './qrcode.decorators';
import { QRcodeService } from './qrcode.service';
import { Public } from 'src/global/common/decorator/public.decorator';
import { MonthDto } from '../admin/dto/monthData.dto';

@ApiTags('QRCODE')
@Controller('api/qrcode')
export class QRcodeController {
  constructor(private readonly qrcodeService: QRcodeService) {}

  @CreateQRCode()
  @Post()
  async createQRcode(@CurrentUser() user: JwtPayload) {
    return await this.qrcodeService.createQRcode(user);
  }

  @UseGym()
  @Post('/:date/:userId/:gymId')
  async useGym(@Param('date') date: number, @Param('userId') userId: number, @Param('gymId') gymId: number) {
    return await this.qrcodeService.useGym(gymId, date, userId);
  }

  @GetUseHistory()
  @Get('/userHistory/:userId')
  async findUseRecord(@Param('userId') userId: number) {
    return await this.qrcodeService.findUseRecord(userId);
  }
}
