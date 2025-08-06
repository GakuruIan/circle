import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseGuardAuth } from './firebase-auth.guard';

@Global()
@Module({
  exports: [FirebaseService, FirebaseGuardAuth],
  providers: [FirebaseService, FirebaseGuardAuth],
})
export class FirebaseModule {}
