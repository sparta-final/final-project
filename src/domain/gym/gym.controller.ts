import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import { UpdateGymDto } from './dto/updateGym.dto';
import { FileUpload, GymDelete, GymSignup, GymUpdate, MyGymGet } from './gym.decorators';
import { GymService } from './gym.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

@ApiTags('GYM')
@Controller('api/gym')
export class GymController {
  constructor(private gymservice: GymService) {}

  @GymSignup()
  @Post()
  async postGyms(@Body() postgymDto: PostGymDto, @CurrentUser() user: JwtPayload) {
    const gym = await this.gymservice.postGyms(postgymDto, user);
    return gym;
  }

  @MyGymGet()
  @Get()
  async getGyms(@CurrentUser() user: JwtPayload) {
    const getGym = await this.gymservice.getGyms(user);
    return getGym;
  }

  @GymUpdate()
  @Put('/:id')
  async updateGym(@Param('id') gymId: number, @Body() updateDto: UpdateGymDto, @CurrentUser() user: JwtPayload) {
    return await this.gymservice.updateGym(
      gymId,
      updateDto.name,
      updateDto.phone,
      updateDto.address,
      updateDto.description,
      updateDto.certification,
      user
    );
  }

  @GymDelete()
  @Delete('/:id')
  async deleteGym(@Param('id') gymId: number, @CurrentUser() user: JwtPayload) {
    return await this.gymservice.deleteGym(gymId, user);
  }
}
