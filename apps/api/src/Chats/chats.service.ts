import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateChatDTO } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly db: PrismaService) {}

  async FindOrCreateChat(currentUserId: string, dto: CreateChatDTO) {
    try {
      if (!dto.participants) {
        throw new BadRequestException('Another participant is required');
      }

      const otherParticipantId = dto.participants.userId;

      const [participant1Id, participant2Id] = [
        currentUserId,
        otherParticipantId,
      ].sort();

      const [users, isBlocked] = await Promise.all([
        this.db.user.findMany({
          where: {
            id: { in: [currentUserId, otherParticipantId] },
          },
          select: { id: true },
        }),

        this.db.blockedUser.findFirst({
          where: {
            OR: [
              {
                blockedUserId: currentUserId,
                blockingUserId: otherParticipantId,
              },
              {
                blockedUserId: otherParticipantId,
                blockingUserId: currentUserId,
              },
            ],
          },
          select: {
            id: true,
          },
        }),
      ]);

      if (users.length !== 2) {
        throw new BadRequestException('One or more participants not found');
      }

      if (isBlocked) {
        throw new BadRequestException('Cannot create chat with blocked users');
      }

      const existingchat = await this.db.chat.findFirst({
        where: {
          isGroup: false,
          participant1Id,
          participant2Id,
        },
        select: {
          id: true,
        },
        // include: {
        //   participants: {
        //     include: {
        //       user: {
        //         select: {
        //           id: true,
        //           name: true,
        //           profileImage: true,
        //           phoneNumber: true,
        //         },
        //       },
        //     },
        //   },
        // },
      });

      if (existingchat) {
        return existingchat;
      }

      const newChat = await this.db.chat.create({
        data: {
          isGroup: false,
          participant1Id,
          participant2Id,
          participants: {
            createMany: {
              data: [
                { userId: participant1Id, role: 'MEMBER' },
                { userId: participant2Id, role: 'MEMBER' },
              ],
            },
          },
        },
        select: {
          id: true,
        },
      });

      return newChat;
    } catch (error) {
      throw error;
    }
  }

  async GetUsersChat(currentUserId: string) {
    try {
      if (!currentUserId) {
        throw new BadRequestException('User Id is required');
      }

      const chats = await this.db.chat.findMany({
        where: {
          isGroup: false,
          participants: {
            some: {
              userId: currentUserId,
              leftAt: null,
            },
          },
          lastMessageId: { not: null },
        },
        include: {
          participants: {
            where: {
              userId: { not: currentUserId },
              leftAt: null,
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phoneNumber: true,
                  profileImage: true,
                  isOnline: true,
                  lastSeen: true,
                  contactOf: {
                    where: {
                      userId: currentUserId,
                    },
                    select: {
                      displayName: true,
                    },
                  },
                },
              },
            },
          },
          lastMessage: {
            select: {
              id: true,
              text: true,
              sentAt: true,
              mediaType: true,
              edited: true,
              mediaUrl: true,
              deliveredTo: {
                select: {
                  readAt: true,
                  status: true,
                  deliveredAt: true,
                },
              },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  deliveredTo: {
                    some: {
                      userId: currentUserId,
                      status: { not: 'READ' },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: [
          {
            lastMessageAt: {
              sort: 'desc',
              nulls: 'last',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
      });

      return chats.map((chat) => this.FormattedChat(chat));
    } catch (error) {
      throw error;
    }
  }

  private FormattedChat(chat) {
    if (!chat.isGroup) {
      const otherParticipant = chat.participants[0].user;
      return {
        id: chat.id,
        isGroup: chat.isGroup,
        name:
          otherParticipant?.contactOf[0]?.displayName ||
          otherParticipant.phoneNumber,
        avatarUrl: otherParticipant.profileImage,
        unreadCount: chat._count?.messages || 0,
        lastMessage: chat.lastMessage
          ? {
              id: chat.lastMessage.id,
              text: chat.lastMessage.text,
              sentAt: chat.lastMessage.sentAt,
              mediaType: chat.lastMessage.mediaType,
              mediaUrl: chat.lastMessage.mediaUrl,
              edited: chat.lastMessage.edited,
            }
          : null,
        createdAt: chat.createdAt,
        updatedAt: chat.lastMessageAt || chat.createdAt,
      };
    }

    return {
      id: chat.id,
      isGroup: chat.isGroup,
      name: chat.name,
      avatarUrl: chat.avatarUrl,
      unreadCount: chat._count?.messages || 0,
      participants: chat.participants,
      lastMessage: chat.lastMessage
        ? {
            id: chat.lastMessage.id,
            text: chat.lastMessage.text,
            sentAt: chat.lastMessage.sentAt,
            mediaType: chat.lastMessage.mediaType,
            mediaUrl: chat.lastMessage.mediaUrl,
            edited: chat.lastMessage.edited,
          }
        : null,
      createdAt: chat.createdAt,
      updatedAt: chat.lastMessageAt || chat.createdAt,
    };
  }

  async CreateLabel(currentUserId: string, name: string) {
    try {
      if (!currentUserId) {
        throw new BadRequestException('User Id is required');
      }

      if (!name) {
        throw new BadRequestException('Label name is required');
      }

      const newLabel = await this.db.label.create({
        data: {
          name,
          user: {
            connect: {
              id: currentUserId,
            },
          },
        },
      });

      return newLabel;
    } catch (error) {
      throw error;
    }
  }

  async EditLabel(labelId: string, name: string) {
    try {
      if (!labelId) {
        throw new BadRequestException('Label Id is required');
      }

      if (!name) {
        throw new BadRequestException('Label name is required');
      }

      const updatedLabel = await this.db.label.update({
        where: {
          id: labelId,
        },
        data: {
          name,
        },
      });

      return updatedLabel;
    } catch (error) {
      throw error;
    }
  }

  async GetUserLabels(currentUserId: string) {
    try {
      if (!currentUserId) {
        throw new BadRequestException('User Id is required');
      }

      const labels = await this.db.label.findMany({
        where: {
          userId: currentUserId,
        },
      });

      return labels;
    } catch (error) {
      throw error;
    }
  }

  async AddChatToLabel(chatId: string, labelId: string) {
    try {
      if (!chatId || !labelId) {
        throw new BadRequestException('Chat Id and Label Id are required');
      }

      const newChatLabel = await this.db.chatLabel.create({
        data: {
          chat: {
            connect: {
              id: chatId,
            },
          },
          label: {
            connect: {
              id: labelId,
            },
          },
        },
      });

      return newChatLabel;
    } catch (error) {
      throw error;
    }
  }

  async RemoveChatFromLabel(chatId: string, labelId: string) {
    try {
      if (!chatId || !labelId) {
        throw new BadRequestException('Chat Id and Label Id are required');
      }

      const chatLabel = await this.db.chatLabel.findFirst({
        where: {
          chatId,
          labelId,
        },
      });

      if (!chatLabel) {
        throw new BadRequestException('Chat Label not found');
      }

      await this.db.chatLabel.delete({
        where: {
          id: chatLabel.id,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
