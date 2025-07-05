import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';

import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createUser(data: CreateUserDto, photo?: Express.Multer.File) {
    // const decoded = await this.firebase.verifyIdToken(data.firebaseId);

    // if (!decoded || !decoded.phone_number || !decoded.uid) {
    //   throw new BadRequestException('Invalid Firebase token');
    // }

    // const existingUser = await this.db.user.findUnique({
    //   where: { firebaseId: decoded.uid },
    // });

    // if (existingUser) {
    //   throw new BadRequestException('User already exists');
    // }

    let photoUrl: UploadApiResponse | undefined = undefined;

    if (photo) {
      photoUrl = await this.cloudinary.uploadImage(photo);
    }

    const user = await this.db.user.create({
      data: {
        name: data.name,
        firebaseId: data.firebaseId, // change this back to decode.uid
        about: data.about,
        phoneNumber: data.phoneNumber, // change this back to decode.phone_number
        hasCompletedSetup: true,
        profileImage: photoUrl?.secure_url,
        imageId: photoUrl.public_id,
      },
    });

    return user;
  }
}
