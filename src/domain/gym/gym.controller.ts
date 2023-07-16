import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/global/common/decorator/current-user.decorator';
import { Public } from 'src/global/common/decorator/public.decorator';
import { JwtPayload } from '../auth/types/jwtPayload.type';
import { PostGymDto } from './dto/postGym.dto';
import { UpdateGymDto } from './dto/updateGym.dto';
import {
  ApproveGymGet,
  GetAllGym,
  GetById,
  GymDelete,
  GymSignup,
  GymUpdate,
  MyGymGet,
  saveElastic,
  SearchGymByAddress,
  SearchGymByAddressWide,
  SearchGymByText,
  searchGymByTextAutoComplete,
} from './gym.decorators';
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
      { name: 'gymImg', maxCount: 7 },
    ])
  )
  async postGyms(
    @UploadedFiles() file: { certification: Express.MulterS3.File[]; gymImg: Express.MulterS3.File[] },
    @Body() postgymDto: PostGymDto,
    @CurrentUser() user: JwtPayload
  ) {
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
      { name: 'gymImg', maxCount: 7 },
    ])
  )
  async updateGym(
    @UploadedFiles() file: { certification: Express.MulterS3.File[]; gymImg: Express.MulterS3.File[] },
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
  @Get('/all')
  async getAllGym() {
    return this.gymservice.getAllGym();
  }

  @GetById()
  @Public()
  @Get('/list/:id')
  async getGymById(@Param('id') gymId: number) {
    return this.gymservice.getGymsById(gymId);
  }

  @SearchGymByText()
  @Public()
  @Get('/search/:text/:offset/:limit')
  async searchGymByText(@Param('text') text: string, @Param('offset') offset: string, @Param('limit') limit: string) {
    const parseOffset = parseInt(offset, 10);
    const parseLimit = parseInt(limit, 10);
    return this.gymservice.searchGymByText(text, parseOffset, parseLimit);
  }

  @searchGymByTextAutoComplete()
  @Public()
  @Get('/search/:text/autocomplete')
  async searchGymByTextAutoComplete() {
    return this.gymservice.searchGymByTextForAutoComplete();
  }

  @ApproveGymGet()
  @Public()
  @Get('/approveGym')
  async approveGymGet() {
    return await this.gymservice.approveGymGet();
  }

  @SearchGymByAddress()
  @Public()
  @Get('/address/:text/:offset/:limit')
  async searchGymByAddress(@Param('text') text: string, @Param('offset') offset: string, @Param('limit') limit: string) {
    const parseOffset = parseInt(offset, 10);
    const parseLimit = parseInt(limit, 10);
    return await this.gymservice.searchGymByAddress(text, parseOffset, parseLimit);
  }

  @SearchGymByAddressWide()
  @Public()
  @Get('/address/wide/:text/:offset/:limit')
  async searchGymByAddressWide(@Param('text') text: string, @Param('offset') offset: string, @Param('limit') limit: string) {
    const parseOffset = parseInt(offset, 10);
    const parseLimit = parseInt(limit, 10);
    return await this.gymservice.searchGymByAddressWide(text, parseOffset, parseLimit);
  }

  @saveElastic()
  @Public()
  @Get('/admin/saveElastic')
  async saveElastic() {
    return await this.gymservice.saveGymToElasticSearch();
  }
}
