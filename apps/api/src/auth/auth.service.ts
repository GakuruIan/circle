import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { prisma } from '@circle/prisma';

@Injectable()
export class AuthServices {
  constructor(private db: typeof prisma) {}

  async createUser(data: CreateUserDto) {
    return this.db.user.create({ data });
  }
}
