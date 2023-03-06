import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@Controller()
export class AppController {
  @Get('map')
  @Public()
  @Render('map')
  async View() {
    return;
  }
}
