import { AdminService } from './admin.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/global/common/decorator/public.decorator';

// 전체 admin만 접근 권한
@ApiTags('Admin')
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Public()
  @Get('/member')
  async getMember() {
    return await this.adminService.getMember();
  }
}
