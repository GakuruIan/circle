import { Body, Controller, Post } from '@nestjs/common';

import { AuthServices } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('signup')
  create(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }
}
