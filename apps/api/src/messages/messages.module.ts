import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';
import { MessageService } from '@/messages/messages.service';
import { MessageGateway } from './messages.gateway';
@Module({
  controllers: [MessagesController],
  imports: [PrismaModule, CloudinaryModule],
  providers: [MessageService, MessageGateway],
})
export class MessagesModule {}
