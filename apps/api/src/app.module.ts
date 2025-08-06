import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './Chats/chats.module';
import { ContactsModule } from './contacts/contacts.module';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    HealthModule,
    ChatModule,
    ContactsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
