import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto';
import { UserService } from './user.service';
import { DeleteUserInfo, GetUserInfo, UpdateUserInfo } from './user.decorators';

@Controller('api/auth')
export class UserController {
  constructor(private userservice: UserService) {}

  // 일반유저 회원정보 불러오기
  @Get('user/:userId')
  @GetUserInfo()
  async getUserInfo(@Param('userId') userId: number) {
    const user = await this.userservice.getUserInfo(userId);
    return user;
  }

  // 일반유저 회원정보 수정하기
  @Put('user/:userId')
  @UpdateUserInfo()
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUserInfo(
    @Param('userId') userId: number,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() updateUserInfo: UpdateUserInfoDto
  ) {
    return await this.userservice.updateUserInfo(userId, updateUserInfo, file);
  }

  // 일반유저 탈퇴하기
  @Put('user/delete/:userId')
  @DeleteUserInfo()
  async deleteUser(@Param('userId') userId: number) {
    return await this.userservice.deleteUser(userId);
  }
}
