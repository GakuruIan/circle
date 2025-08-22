import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  Req,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseGuardAuth } from '@/firebase/firebase-auth.guard';

import { Response, Request } from 'express';

import { ChatService } from './chats.service';
import { CreateChatDTO } from './dto/chat.dto';

import * as admin from 'firebase-admin';
import { PrismaService } from '@/prisma/prisma.service';

UseGuards(FirebaseGuardAuth);
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatservice: ChatService,
    private readonly db: PrismaService,
  ) {}

  @Post('find-or-create')
  @UseGuards(FirebaseGuardAuth)
  async findOrCreate(
    @Body() dto: CreateChatDTO,
    @Res() res: Response,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
  ) {
    try {
      const { uid } = req.user;

      const user = await this.db.user.findUnique({
        where: {
          firebaseId: uid,
        },
        select: {
          id: true,
        },
      });

      const chat = await this.chatservice.FindOrCreateChat(user.id, dto);

      return res.status(200).send(chat);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  @Get()
  @UseGuards(FirebaseGuardAuth)
  async FetchUsersChats(
    @Res() res: Response,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
  ) {
    try {
      const { uid } = req.user;

      const user = await this.db.user.findUnique({
        where: {
          firebaseId: uid,
        },
        select: {
          id: true,
        },
      });

      const chats = await this.chatservice.GetUsersChat(user.id);

      res.status(HttpStatus.OK).send(chats);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
