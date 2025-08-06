import { Controller, Post, UseGuards } from '@nestjs/common';
import { FirebaseGuardAuth } from '@/firebase/firebase-auth.guard';

import { ChatService } from './chats.service';

UseGuards(FirebaseGuardAuth);
@Controller('chats')
export class ChatController {
  constructor(private readonly chatservice: ChatService) {}

  @Post()
  async createChat() {}
}
