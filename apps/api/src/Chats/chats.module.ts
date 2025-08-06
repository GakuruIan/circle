import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CloudinaryModule } from '@/Cloudinary/cloudinary.module';

import { ChatService } from './chats.service';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, CloudinaryModule],
  providers: [ChatService],
})
export class ChatModule {}
