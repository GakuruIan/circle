import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { Response, Request } from 'express';

// auth guard
import { FirebaseGuardAuth } from '@/firebase/firebase-auth.guard';

// service
import { MessageService } from './messages.service';

// dto
import { CreateMessageDTO, GetMessageDTO } from './dto/message.dto';

@Controller('messages')
@UseGuards(FirebaseGuardAuth)
export class MessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  async onMessageSend(
    @Body() dto: CreateMessageDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const message = await this.messageService.sendMessage(dto, req as any);
      return res.status(HttpStatus.OK).send(message);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  @Get()
  async FetchMessages(
    @Body() dto: GetMessageDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const messages = await this.messageService.GetChatMessages(
        dto,
        req as any,
      );

      res.status(HttpStatus.OK).send(messages);
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}
