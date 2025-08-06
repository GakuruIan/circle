import { Module } from '@nestjs/common';

import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';

import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContactsService],
  controllers: [ContactsController],
})
export class ContactsModule {}
