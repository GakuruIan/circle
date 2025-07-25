import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Put,
  UseGuards,
  Param,
  Req,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseGuardAuth } from './firebase-auth.guard';
import * as admin from 'firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseGuards(FirebaseGuardAuth)
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const user = await this.authService.createUser(dto, req as any, photo);
    res.status(HttpStatus.CREATED).send(user);
  }

  @Put('update-profile/:id')
  @UseGuards(FirebaseGuardAuth)
  @UseInterceptors(FileInterceptor('photo'))
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Res() res: Response,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const user = await this.authService.updateUser(id, dto, photo);

    res.status(200).send(user);
  }
}
