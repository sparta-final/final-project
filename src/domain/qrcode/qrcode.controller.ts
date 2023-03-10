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
  @Post('/:date/:userId')
  async useGym(@Param('date') date: number, @Param('userId') userId: number, @CurrentUser() businessUser: JwtPayload) {
    return await this.qrcodeService.useGym(businessUser, date, userId);
  }

  @GetUseHistory()
  @Get('/userecord/:year/:month')
  async findUseRecord(@Param() date: MonthDto, @CurrentUser() user: JwtPayload) {
    return await this.qrcodeService.findUseRecord(date, user);
  }
}
