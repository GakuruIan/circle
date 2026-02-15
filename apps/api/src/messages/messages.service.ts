import {
  Injectable,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import * as admin from 'firebase-admin';
import { CreateMessageDTO, GetMessageDTO } from '@/messages/dto/message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly db: PrismaService) {}

  async sendMessage(data: CreateMessageDTO, uid: string) {
    if (!data.chatId) {
      throw new BadRequestException('Chat ID is required');
    }

    const chatId = data.chatId;

    // Step 1: Get user
    const user = await this.db.user.findUnique({
      where: { firebaseId: uid },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException('Current user does not exist');
    }

    // Step 2: Validate chat participation
    const chatParticipant = await this.db.chatParticipants.findFirst({
      where: {
        userId: user.id,
        chatId,
        leftAt: null,
      },
      select: {
        role: true,
        chat: {
          select: {
            isGroup: true,
            onlyAdminsCanMessage: true,
            participant1Id: true,
            participant2Id: true,
          },
        },
      },
    });

    if (!chatParticipant) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    // Step 3: Check admin permissions
    if (
      chatParticipant.chat.isGroup &&
      chatParticipant.role !== 'ADMIN' &&
      chatParticipant.chat.onlyAdminsCanMessage
    ) {
      throw new ForbiddenException('Admins can only send message');
    }

    // Step 4: Check block status
    if (!chatParticipant.chat.isGroup) {
      const { participant1Id, participant2Id } = chatParticipant.chat;
      const otherParticipantId =
        participant1Id === user.id ? participant2Id : participant1Id;

      if (otherParticipantId) {
        const isBlocked = await this.db.blockedUser.findFirst({
          where: {
            OR: [
              { blockingUserId: otherParticipantId, blockedUserId: user.id },
              { blockingUserId: user.id, blockedUserId: otherParticipantId },
            ],
          },
          select: { blockingUserId: true },
        });

        if (isBlocked) {
          const message =
            isBlocked.blockingUserId === user.id
              ? 'You cannot send messages to this user as you have blocked them'
              : 'You cannot send messages to this user as they have blocked you';
          throw new ForbiddenException(message);
        }
      }
    }

    // Step 5: Validate replied message
    if (data.repliedToId) {
      const repliedMessageExists = await this.db.message.findFirst({
        where: { id: data.repliedToId, chatId },
        select: { id: true },
      });

      if (!repliedMessageExists) {
        throw new BadRequestException('Replied message not found in this chat');
      }
    }

    // Step 6: Create message - NO TRANSACTION
    const message = await this.db.message.create({
      data: {
        text: data.text,
        senderId: data.senderId,
        repliedToId: data.repliedToId,
        mediaId: data.mediaId,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaType,
        chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            profileImage: true,
          },
        },
        repliedTo: {
          select: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Step 7: Get recipients - separate query
    const allParticipants = await this.db.chatParticipants.findMany({
      where: {
        chatId,
        leftAt: null,
        userId: { not: user.id }, // Exclude sender
      },
      select: { userId: true },
    });

    const recipientUserIds = allParticipants.map((p) => p.userId);

    // Step 8: Create delivery status - separate operation
    if (recipientUserIds.length > 0) {
      try {
        await this.db.deliveredStatus.createMany({
          data: recipientUserIds.map((userId) => ({
            messageId: message.id,
            userId,
            status: 'SENT' as const,
          })),
          skipDuplicates: true,
        });
      } catch (deliveryError) {
        // Log error but don't fail the entire operation
        console.error('Failed to create delivery status:', deliveryError);
      }
    }

    // Step 9: Update chat last message - separate operation
    try {
      await this.db.chat.update({
        where: { id: chatId },
        data: {
          lastMessageId: message.id,
          lastMessageAt: message.sentAt,
        },
      });
    } catch (updateError) {
      // Log error but don't fail the entire operation
      console.error('Failed to update chat last message:', updateError);
    }

    // Return the response
    return {
      id: message.id,
      text: message.text,
      mediaType: message.mediaType,
      mediaUrl: message.mediaUrl,
      mediaId: message.mediaId,
      sentAt: message.sentAt,
      edited: message.edited,
      chatId,
      sender: message.sender,
      repliedTo: message.repliedTo,
      recipientIds: recipientUserIds,
    };
  }
  async GetChatMessages(
    data: GetMessageDTO,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
  ) {
    const { uid } = req.user;

    const { chatId, lastMessageId, limit = 20 } = data;

    const user = await this.db.user.findUnique({
      where: {
        firebaseId: uid,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Current user does not exist');
    }

    const messages = await this.db.message.findMany({
      where: {
        chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
        repliedTo: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        deliveredTo: {
          select: {
            userId: true,
            status: true,
            deliveredAt: true,
            readAt: true,
          },
        },
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: Number(limit + 1),
      cursor: lastMessageId ? { id: lastMessageId } : undefined,
      skip: lastMessageId ? 1 : 0,
    });

    let nextMessageId: string | null = null;

    if (messages.length > limit) {
      const nextItem = messages.pop();
      nextMessageId = nextItem?.id || null;
    }

    return {
      messages,
      nextMessageId,
    };
  }
}
