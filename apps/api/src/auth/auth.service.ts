import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthServices {
  constructor(private readonly db: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.db.user.create({ data });
  }
}
