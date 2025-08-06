import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/Cloudinary/cloudinary.module';

@Module({
  controllers: [MessagesController],
  imports: [PrismaModule, CloudinaryModule],
})
export class MessagesModule {}
