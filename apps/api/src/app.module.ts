import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthServices } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthServices],
})
export class AppModule {}
