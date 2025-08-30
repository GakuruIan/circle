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

  async sendMessage(
    data: CreateMessageDTO,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
  ) {
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
      throw new BadRequestException('Current user does not exist');
    }

    const chatparticipants = await this.db.chatParticipants.findUnique({
      where: {
        userId_chatId: {
          userId: user.id,
          chatId: data.chatId,
        },
      },
      include: {
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

    if (!chatparticipants || chatparticipants.leftAt) {
      throw new ForbiddenException('You are not a participant in this chat');
    }

    if (
      chatparticipants.chat.isGroup &&
      chatparticipants.role !== 'ADMIN' &&
      chatparticipants.chat.onlyAdminsCanMessage
    ) {
      throw new ForbiddenException('Admins can only send message');
    }

    if (!chatparticipants.chat.isGroup) {
      const { participant1Id, participant2Id } = chatparticipants.chat;

      const otherParticipantId =
        participant1Id !== user.id ? participant2Id : participant1Id;

      if (otherParticipantId) {
        const blockStatus = await this.db.blockedUser.findFirst({
          where: {
            OR: [
              {
                blockingUserId: otherParticipantId,
                blockedUserId: user.id,
              },
              {
                blockingUserId: user.id,
                blockedUserId: otherParticipantId,
              },
            ],
          },
          select: {
            blockedUserId: true,
            blockingUserId: true,
          },
        });

        if (blockStatus) {
          if (blockStatus.blockingUserId === user.id) {
            throw new ForbiddenException(
              'You cannot send messages to this user as you have blocked them',
            );
          } else {
            throw new ForbiddenException(
              'You cannot send messages to this user as they have blocked you',
            );
          }
        }
      }
    }

    if (data.repliedToId) {
      const repliedMessage = await this.db.message.findFirst({
        where: {
          id: data.repliedToId,
          chatId: data.chatId,
        },
      });

      if (!repliedMessage) {
        throw new BadRequestException('Replied message not found in this chat');
      }
    }

    const result = await this.db.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          text: data.text,
          senderId: data.senderId,
          repliedToId: data.repliedToId,
          mediaId: data.mediaId,
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          chatId: data.chatId,
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
          chat: {
            include: {
              participants: {
                where: {
                  leftAt: null,
                },
                select: {
                  userId: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      const recipients = message.chat.participants.filter(
        (p) => p.userId !== user.id,
      );

      // creating delivery status
      if (recipients.length > 0) {
        if (recipients.length === 1 && !chatparticipants.chat.isGroup) {
          await tx.deliveredStatus.create({
            data: {
              messageId: message.id,
              userId: recipients[0].userId,
              status: 'SENT',
            },
          });
        } else {
          const deliveryStatusRecords = recipients.map((participant) => ({
            messageId: message.id,
            userId: participant.userId,
            status: 'SENT' as const,
            createdAt: new Date(),
          }));

          await tx.deliveredStatus.createMany({
            data: deliveryStatusRecords,
          });
        }
      }

      await tx.chat.update({
        where: {
          id: message.chatId,
        },
        data: {
          lastMessageId: message.id,
          lastMessageAt: message.sentAt,
        },
      });

      return {
        message,
        recipientIds: recipients.map((p) => p.userId),
      };
    });

    return {
      id: result.message.id,
      text: result.message.text,
      mediaType: result.message.mediaType,
      mediaUrl: result.message.mediaUrl,
      mediaId: result.message.mediaId,
      sentAt: result.message.sentAt,
      edited: result.message.edited,
      chatId: data.chatId,
      sender: result.message.sender,
      repliedTo: result.message.repliedTo,
      recipientIds: result.recipientIds,
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
      take: limit + 1,
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
