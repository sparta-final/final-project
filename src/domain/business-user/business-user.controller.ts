import { Body, Controller, Get, NestInterceptor, Param, Put, Type, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBusinessUserInfoDto } from './dto/updateBusinessUserInfo.dto';
import { DeleteBusinessUserInfo, GetBusinessUserInfo, GetUserByGymId, UpdateBusinessUserInfo } from './business-user.decorators';
import { BusinessUserService } from './business-user.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@ApiTags('BUSINESS_USER_INFO')
@Controller('api')
export class BusinessUserController {
  constructor(private businessUserService: BusinessUserService) {}

  // 사업자 회원정보 불러오기
  @Get('business')
  @GetBusinessUserInfo()
  async getBusinessUserInfo(@CurrentUser() user: JwtPayload) {
    const businessUser = await this.businessUserService.getBusinessUserInfo(user);
    return businessUser;
  }

  // 사업자 회원정보 수정하기
  @Put('business')
  @UpdateBusinessUserInfo()
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateBusinessUserInfo(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateBusinessUserInfo: UpdateBusinessUserInfoDto
  ) {
    return await this.businessUserService.updateBusinessUserInfo(user, updateBusinessUserInfo, file);
  }

  // 사업자 회원 탈퇴하기
  @Put('business/delete')
  @DeleteBusinessUserInfo()
  async deleteBusinessUser(@CurrentUser() user: JwtPayload) {
    return await this.businessUserService.deleteBusinessUser(user);
  }

  // 업체별 사용자 데이터 불러오기
  @Get('gym/user/:gymId')
  @GetUserByGymId()
  async getUserByGymId(@Param('gymId') gymId: number) {
    return await this.businessUserService.getUserByGymId(gymId);
  }
}
