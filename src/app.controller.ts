import { Controller, Get, Render } from '@nestjs/common';
import { Public } from './global/common/decorator/public.decorator';

@Controller('')
export class AppController {
  @Get()
  @Public()
  @Render('index')
  async index() {
    return;
  }

  @Get('payment')
  @Public()
  @Render('payment')
  async payment() {
    return;
  }

  @Get('complete')
  @Public()
  @Render('paymentComplete')
  async complete() {
    return;
  }
}
