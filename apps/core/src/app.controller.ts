import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({
  version: '1',
})

export class AppController {
  constructor(private appService: AppService) {}

  @Get('/health')
  getHealth() {
    return this.appService.getHealth();
  }
}
