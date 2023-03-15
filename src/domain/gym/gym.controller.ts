import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import { UpdateGymDto } from './dto/updateGym.dto';
import { ApproveGymGet, GetAllGym, GetById, GymDelete, GymSignup, GymUpdate, MyGymGet, SearchGymByText } from './gym.decorators';
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
    console.log('✨✨✨', '1', '✨✨✨');
    const gym = await this.gymservice.postGyms({ file, postgymDto, user });
    return gym;
  }

  @MyGymGet()
  @Get('/my')
  async getGyms(@CurrentUser() user: JwtPayload) {
    console.log('✨✨✨', '2', '✨✨✨');
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
    console.log('✨✨✨', '3', '✨✨✨');
    return await this.gymservice.updateGym({ file, gymId, updateDto, user });
  }

  @GymDelete()
  @Delete('/:id')
  async deleteGym(@Param('id') gymId: number, @CurrentUser() user: JwtPayload) {
    console.log('✨✨✨', '4', '✨✨✨');
    return await this.gymservice.deleteGym({ gymId, user });
  }

  @GetAllGym()
  @Public()
  @Get('/all')
  async getAllGym() {
    console.log('✨✨✨', '5', '✨✨✨');
    return this.gymservice.getAllGym();
  }

  @GetById()
  @Public()
  @Get('/list/:id')
  async getGymById(@Param('id') gymId: number) {
    console.log('✨✨✨', '6', '✨✨✨');
    return this.gymservice.getGymsById(gymId);
  }

  @SearchGymByText()
  @Public()
  @Get('/search/:text')
  async searchGymByText(@Param('text') text: string) {
    console.log('✨✨✨', '7', '✨✨✨');
    return this.gymservice.searchGymByText(text);
  }

  @ApproveGymGet()
  @Public()
  @Get('/approveGym')
  async approveGymGet() {
    console.log('✨✨✨', '8', '✨✨✨');
    return await this.gymservice.approveGymGet();
  }
}
