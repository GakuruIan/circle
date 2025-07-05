import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Make sure this points to your .env file
    }),
  ],
})
export class AppModule {}
