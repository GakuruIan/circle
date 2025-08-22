import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly db: PrismaService) {}

  async getUserId(firebaseId: string) {
    if (!firebaseId) {
      throw new BadRequestException('Firebase Id is missing');
    }

    try {
      const userId = await this.db.user.findUnique({
        where: {
          firebaseId: firebaseId,
        },
        select: {
          id: true,
        },
      });

      return userId;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
