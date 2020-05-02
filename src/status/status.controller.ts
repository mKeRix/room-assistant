import { Controller, Get } from '@nestjs/common';

@Controller('status')
export class StatusController {
  @Get()
  health(): string {
    return 'healthy';
  }
}
