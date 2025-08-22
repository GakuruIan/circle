import { Injectable, Req, BadRequestException } from '@nestjs/common';
import { ChatService } from '@/Chats/chats.service';
import { PrismaService } from '@/prisma/prisma.service';

import * as admin from 'firebase-admin';

@Injectable()
export class MessageService {
  constructor(
    private readonly db: PrismaService,
    private readonly chatService: ChatService,
  ) {}

  async sendMessage(
    data,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
  ) {
    const { uid } = req.user;

    const userId = await this.db.user.findUnique({
      where: {
        firebaseId: uid,
      },
      select: {
        id: true,
      },
    });

    if (!userId) {
      throw new BadRequestException('Current user does not exist');
    }

    const message = await this.db.message.create({
      data: {
        text: data.text,
        chatId: data.id,
        senderId: userId.id,
      },
      include: {
        chat: {
          include: {
            participants: true,
          },
        },
      },
    });

    await this.db.chat.update({
      where: {
        id: data.id,
      },
      data: {
        lastMessageId: message.id,
        lastMessageAt: message.sentAt,
      },
    });

    return {
      ...message,
      chatId: data.id,
    };
  }
}
