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

import type { Response, Request } from 'express';

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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const chats = await this.chatservice.GetUsersChat(user.id);

      res.status(HttpStatus.OK).send(chats);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  @Post('create-label')
  @UseGuards(FirebaseGuardAuth)
  async CreateLabel(
    @Body() dto: { name: string },
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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const label = await this.chatservice.CreateLabel(user.id, dto.name);

      return res.status(200).send(label);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  @Get('labels')
  @UseGuards(FirebaseGuardAuth)
  async GetUserLabels(
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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const labels = await this.chatservice.GetUserLabels(user.id);

      res.status(HttpStatus.OK).send(labels);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }

  @Post('add-chat-to-label')
  @UseGuards(FirebaseGuardAuth)
  async AddChatToLabel(
    @Body() dto: { chatId: string; labelId: string },
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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const chatLabel = await this.chatservice.AddChatToLabel(
        dto.chatId,
        dto.labelId,
      );

      return res.status(200).send(chatLabel);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  @Post('remove-chat-from-label')
  @UseGuards(FirebaseGuardAuth)
  async RemoveChatFromLabel(
    @Body() dto: { chatId: string; labelId: string },
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

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const chatLabel = await this.chatservice.RemoveChatFromLabel(
        dto.chatId,
        dto.labelId,
      );

      return res.status(200).send(chatLabel);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
