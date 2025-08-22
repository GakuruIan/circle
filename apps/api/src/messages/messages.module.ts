import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';
import { ChatModule } from '@/Chats/chats.module';
import { UserModule } from '@/user/user.module';
import { MessageService } from '@/messages/messages.service';

@Module({
  controllers: [MessagesController],
  imports: [PrismaModule, CloudinaryModule, ChatModule, UserModule],
  providers: [MessageService],
})
export class MessagesModule {}
