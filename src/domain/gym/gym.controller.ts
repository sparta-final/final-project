import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import { UpdateGymDto } from './dto/updateGym.dto';
import { GymDelete, GymSignup, GymUpdate, MyGymGet } from './gym.decorators';
import { GymService } from './gym.service';

@ApiTags('GYM')
@Controller('api/gym')
export class GymController {
  constructor(private gymservice: GymService) {}

  @GymSignup()
  @Post()
  @UseInterceptors(FileInterceptor('certification'))
  async postGyms(@UploadedFile() file: Express.MulterS3.File, @Body() postgymDto: PostGymDto, @CurrentUser() user: JwtPayload) {
    const gym = await this.gymservice.postGyms(file, postgymDto, user);
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
    return await this.gymservice.updateGym({ gymId, updateDto, user });
  }

  @GymDelete()
  @Delete('/:id')
  async deleteGym(@Param('id') gymId: number, @Body() password: string, @CurrentUser() user: JwtPayload) {
    return await this.gymservice.deleteGym({ gymId, password, user });
  }
}
