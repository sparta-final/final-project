import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@Controller('')
export class AppController {
  @Get()
  @Public()
  @Render('index')
  async view() {
    return;
  }
}
