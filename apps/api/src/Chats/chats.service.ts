import { PrismaService } from '@/prisma/prisma.service';

export class ChatService {
  constructor(private readonly db: PrismaService) {}
}
