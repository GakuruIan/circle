/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { FirebaseService } from '@/firebase/firebase.service';

@Injectable()
export class FirebaseGuardAuth implements CanActivate {
  constructor(private readonly firebase: FirebaseService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader =
      request.headers.authorization || request.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const idToken = authHeader?.substring(7);

    try {
      const decodedToken = await this.firebase.verifyIdToken(idToken);
      request.user = decodedToken;
      return true;
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
