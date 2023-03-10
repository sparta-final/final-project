import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import { UpdateGymDto } from './dto/updateGym.dto';
import { GetAllGym, GetById, GymDelete, GymSignup, GymUpdate, MyGymGet } from './gym.decorators';
import { GymService } from './gym.service';

@ApiTags('GYM')
@Controller('api/gym')
export class GymController {
  constructor(private gymservice: GymService) {}

  @GymSignup()
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certification', maxCount: 3 },
      { name: 'img', maxCount: 7 },
    ])
  )
  async postGyms(
    @UploadedFiles() file: { certification: Express.MulterS3.File[]; img: Express.MulterS3.File[] },
    @Body() postgymDto: PostGymDto,
    @CurrentUser() user: JwtPayload
  ) {
    console.log('gd', postgymDto);
    const gym = await this.gymservice.postGyms({ file, postgymDto, user });
    return gym;
  }

  @MyGymGet()
  @Get('/my')
  async getGyms(@CurrentUser() user: JwtPayload) {
    const getGym = await this.gymservice.getGyms(user);
    return getGym;
  }

  @GymUpdate()
  @Put('/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certification', maxCount: 3 },
      { name: 'img', maxCount: 7 },
    ])
  )
  async updateGym(
    @UploadedFiles() file: { certification: Express.MulterS3.File[]; img: Express.MulterS3.File[] },
    @Param('id') gymId: number,
    @Body() updateDto: UpdateGymDto,
    @CurrentUser() user: JwtPayload
  ) {
    return await this.gymservice.updateGym({ file, gymId, updateDto, user });
  }

  @GymDelete()
  @Delete('/:id')
  async deleteGym(@Param('id') gymId: number, @CurrentUser() user: JwtPayload) {
    return await this.gymservice.deleteGym({ gymId, user });
  }

  @GetAllGym()
  @Public()
  @Get()
  async getAllGym() {
    return this.gymservice.getAllGym();
  }

  @GetById()
  @Get('/:id')
  async getGymById(@Param('id') gymId: number) {
    return this.gymservice.getGymsById(gymId);
  }
}
