import { Module } from '@nestjs/common';
// app modules
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './Chats/chats.module';
import { ContactsModule } from './contacts/contacts.module';
import { UserModule } from '@/user/user.module';
import { MessagesModule } from './messages/messages.module';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    HealthModule,
    ChatModule,
    ContactsModule,
    UserModule,
    MessagesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
