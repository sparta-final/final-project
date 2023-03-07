import { AdminService } from './admin.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';
import { ApproveDto } from './dto/approveGym.dto';
import { approveGym, getApproveGyms, getMembers, salesAll, salesMonth } from './admin.decorators';
import { MonthDto } from './dto/approveGym.dto copy';

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
}
