/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../firebase-service-account.json',
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (!idToken) {
      throw new Error('No ID token provided');
    }

    if (typeof idToken !== 'string') {
      throw new Error('ID token must be a string');
    }

    // Check JWT format
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      console.log('❌ Invalid JWT format. Parts:', parts.length);
      throw new Error(
        'Invalid JWT format - token should have 3 parts separated by dots',
      );
    }

    // Check if it starts with expected JWT header
    if (!idToken.startsWith('eyJ')) {
      console.log('❌ Token does not start with eyJ');
      throw new Error('Invalid JWT format - should start with eyJ');
    }

    try {
      console.log('✅ Attempting Firebase verification...');
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log('✅ Token verified successfully for user:', decodedToken.uid);
      return decodedToken;
    } catch (error) {
      console.log('❌ Firebase verification failed:', error.message);
      console.log('❌ Error code:', error.code);
      throw error;
    }
  }
}
