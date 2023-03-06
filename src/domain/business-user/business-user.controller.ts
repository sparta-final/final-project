import { Body, Controller, Get, NestInterceptor, Param, Put, Type, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBusinessUserInfoDto } from './dto/updateBusinessUserInfo.dto';
import { DeleteBusinessUserInfo, GetBusinessUserInfo, UpdateBusinessUserInfo } from './business-user.decorators';
import { BusinessUserService } from './business-user.service';

@Controller('api')
export class BusinessUserController {
  constructor(private businessUserService: BusinessUserService) {}

  // 사업자 회원정보 불러오기
  @Get('auth/business/:businessUserId')
  @GetBusinessUserInfo()
  async getBusinessUserInfo(@Param('businessUserId') businessUserId: number) {
    const businessUser = await this.businessUserService.getBusinessUserInfo(businessUserId);
    return businessUser;
  }

  // 사업자 회원정보 수정하기
  @Put('auth/business/:businessUserId')
  @UpdateBusinessUserInfo()
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateBusinessUserInfo(
    @Param('businessUserId') businessUserId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateBusinessUserInfo: UpdateBusinessUserInfoDto
  ) {
    return await this.businessUserService.updateBusinessUserInfo(businessUserId, updateBusinessUserInfo, file);
  }

  // 사업자 회원 탈퇴하기
  @Put('auth/business/delete/:businessUserId')
  @DeleteBusinessUserInfo()
  async deleteBusinessUser(@Param('businessUserId') businessUserId: number) {
    return await this.businessUserService.deleteBusinessUser(businessUserId);
  }

  // 업체별 사용자 데이터 불러오기
  @Get('user/:month/:gymId')
  async getBusinessUserByGymId(@Param('month') month: num, @Param('gymId') gymId: number) {
    return await this.businessUserService.getBusinessUserByGymId(month, gymId);
  }
}
