import { CalculateDto } from './dto/calculate.dto';
import { AdminService } from './admin.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { ApproveDto } from './dto/approveGym.dto';
import {
  approveGym,
  calculate,
  CalculateGym,
  getApproveGyms,
  getBeforeApproveGyms,
  getMembers,
  GetVisitUsers,
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
  async getMember() {
    return await this.adminService.getMember();
  }

  @Get('/gym')
  @getApproveGyms()
  async getGym() {
    return await this.adminService.getGym();
  }

  @Get('/beforeApprove')
  @getBeforeApproveGyms()
  async beforeApproveGym() {
    return await this.adminService.beforeApproveGym();
  }

  @Get('/beforeApprove/:id')
  @getBeforeApproveGyms()
  async beforeApproveGymId(@Param('id') id: ApproveDto) {
    return await this.adminService.beforeApproveGymId(id);
  }

  @Put('/approve')
  @approveGym()
  async approveGym(@Body() gym: ApproveDto) {
    return await this.adminService.approveGym(gym.id);
  }

  @Get('/sales')
  @salesAll()
  async getSalesAll() {
    return await this.adminService.getSalesAll();
  }

  @Get('/sales/:year/:month')
  @salesMonth()
  async getSalesMonth(@Param() date: MonthDto) {
    return await this.adminService.getSalesMonth(date);
  }

  @Get('rank/:category/:year/:month')
  @gymRank()
  async getRank(@Param() date: MonthDto) {
    return await this.adminService.getRank(date);
  }

  @Post('/calculate/:id')
  @calculate()
  async calculate(@Param('id') id: CalculateDto, @Body() date: MonthDto) {
    const calculatePaid = await this.adminService.calculatePaid(id, date);
    return calculatePaid;
  }

  @Get('/visituser/:id/:year/:month')
  @GetVisitUsers()
  async getVisitUser(@Param('id') gymId: number, @Param() date: MonthDto) {
    return await this.adminService.getVisitUser(gymId, date);
  }

  @Get('/calculate/:id/:year/:month')
  @CalculateGym()
  async getPaidGym(@Param('id') gymId: number, @Param() date: MonthDto) {
    return await this.adminService.getPaidGym(gymId, date);
  }
}
