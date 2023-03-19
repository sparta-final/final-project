import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Render,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UserService } from './user.service';
import { DeleteUserInfo, GetUserInfo, UpdateUserInfo } from './user.decorators';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';

@ApiTags('USER_INFO')
@Controller('api')
export class UserController {
  constructor(private userservice: UserService) {}

  // 일반유저 회원정보 불러오기
  @Get('user')
  @GetUserInfo()
  async getUserInfo(@CurrentUser() user: JwtPayload) {
    return await this.userservice.getUserInfo(user);
  }

  // 일반유저 회원정보 수정하기
  @Put('user')
  @UpdateUserInfo()
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUserInfo(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateUserInfo: UpdateUserInfoDto
  ) {
    return await this.userservice.updateUserInfo(user, updateUserInfo, file);
  }

  // 일반유저 탈퇴하기
  @Put('user/delete')
  @DeleteUserInfo()
  async deleteUser(@CurrentUser() user: JwtPayload) {
    return await this.userservice.deleteUser(user);
  }

  // 일반유저 년,월별 usergym 이용내역 불러오기
  @Get('user/visit/:year/:month')
  // @GetUseGymHistory()
  async getUseGymHistory(@CurrentUser() user: JwtPayload, @Param('year') year: number, @Param('month') month: number) {
    return await this.userservice.getUseGymHistory(user, year, month);
  }

  // 로그인유저 아이디만 가져오기
  @Get('loginUser/info')
  async loginUserInfo(@CurrentUser() user: JwtPayload) {
    return await this.userservice.loginUserInfo(user);
  }
  // qrcode 인증
  @Get('qrcode/:id')
  async qrcodeAuth(@Param('id') id: number) {
    return await this.userservice.qrcodeAuth(id);
  }
}
