import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const user = this.authService.createUser(dto, photo);
    res.status(HttpStatus.CREATED).send(user);
  }
}
