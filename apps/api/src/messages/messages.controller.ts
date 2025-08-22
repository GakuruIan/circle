import {
  Body,
  Controller,
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
import { CreateMessageDTO } from './dto/message.dto';

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
}
