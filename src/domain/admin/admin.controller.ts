import { CalculateDto } from './dto/calculate.dto';
import { AdminService } from './admin.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { ApproveDto } from './dto/approveGym.dto';
import { approveGym, calculate, getApproveGyms, getMembers, gymRank, salesAll, salesMonth } from './admin.decorators';
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

  @Get('rank/:category')
  @gymRank()
  @Public()
  async getRank(@Param() category: RankDto) {
    return category;
  }

  @Post('/calculate/:id')
  @calculate()
  @Public()
  async calculate(@Param('id') id: CalculateDto, @Body() date: MonthDto) {
    // const getVisitUser = await this.adminService.getVisitUser(id, date);
    // // 방문 리스트 중 중복된 userId 제거 (lodash 함수 이용)
    // const visitUser = _.uniqBy(getVisitUser, 'userId');
    // let totalPaid = 0;
    // visitUser.forEach(async (a) => {
    //   // 방문유저 이번달 전체 헬스장 이용 횟수 조회
    //   const getVisitGym = await this.adminService.getVisitGym(a.userId, date);

    //   // 방문유저 멤버십 조회
    //   const getMembership = await this.adminService.getMembership(a.userId);

    //   let paid = 0;
    //   if (getMembership[0].membership === 'Basic') {
    //     paid = 80000 / getVisitGym;
    //   }
    //   if (getMembership[0].membership === 'Standard') {
    //     paid = 160000 / getVisitGym;
    //   }
    //   if (getMembership[0].membership === 'Premium') {
    //     paid = 240000 / getVisitGym;
    //   }

    //   const getVisitUserCount = await this.adminService.getVisitUserCount(id, a.userId, date);
    //   let userPaid = Math.ceil((getVisitUserCount * paid) / 10) * 10;
    //   totalPaid += userPaid;
    //   console.log('✨✨✨', totalPaid, '✨✨✨');
    // });
    const calculatePaid = await this.adminService.calculatePaid(id, date);
    return calculatePaid;
  }
}
