import { CalculateDto } from './dto/calculate.dto';
import { AdminService } from './admin.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { ApproveDto } from './dto/approveGym.dto';
import {
  approveGym,
  calculate,
  getApproveGyms,
  getBeforeApproveGyms,
  getMembers,
  gymRank,
  salesAll,
  salesMonth,
} from './admin.decorators';
import { MonthDto } from './dto/monthData.dto';
import { RankDto } from './dto/gymRank.dto';
import * as _ from 'lodash';

// 전체 admin만 접근 권한
@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/member')
  @getMembers()
  @Public()
  async getMember() {
    return await this.adminService.getMember();
  }

  @Get('/gym')
  @getApproveGyms()
  @Public()
  async getGym() {
    return await this.adminService.getGym();
  }

  @Get('/beforeApprove')
  @getBeforeApproveGyms()
  @Public()
  async beforeApproveGym() {
    return await this.adminService.beforeApproveGym();
  }

  @Put('/approve')
  @approveGym()
  @Public()
  async approveGym(@Body() id: ApproveDto) {
    return await this.adminService.approveGym(id);
  }

  @Get('/sales')
  @salesAll()
  @Public()
  async getSalesAll() {
    return await this.adminService.getSalesAll();
  }

  @Get('/sales/:year/:month')
  @salesMonth()
  @Public()
  async getSalesMonth(@Param() date: MonthDto) {
    return await this.adminService.getSalesMonth(date);
  }

  @Get('rank/:category/:year/:month')
  @gymRank()
  @Public()
  async getRank(@Param() date: MonthDto) {
    return await this.adminService.getRank(date);
  }

  @Post('/calculate/:id')
  @calculate()
  @Public()
  async calculate(@Param('id') id: CalculateDto, @Body() date: MonthDto) {
    const calculatePaid = await this.adminService.calculatePaid(id, date);
    return calculatePaid;
  }
}
