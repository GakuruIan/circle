import { Get, Controller } from '@nestjs/common';

@Controller()
export class HealthController {
  constructor() {}

  @Get('/health')
  async status() {
    return 'Status okay';
  }
}
