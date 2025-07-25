/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException, Req } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import * as admin from 'firebase-admin';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async createUser(
    data: CreateUserDto,
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
    photo?: Express.Multer.File,
  ) {
    const { uid, phone_number } = req.user;

    if (!phone_number || !uid) {
      throw new BadRequestException('Invalid Firebase token');
    }

    const existingUser = await this.db.user.findUnique({
      where: { firebaseId: uid },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    let photoUrl: UploadApiResponse | undefined = undefined;

    if (photo) {
      photoUrl = await this.cloudinary.uploadImage(photo, {
        folder: 'user_profiles',
        media_type: 'image',
      });
    }

    const user = await this.db.user.create({
      data: {
        name: data.name,
        firebaseId: uid,
        about: data.about,
        phoneNumber: phone_number,
        hasCompletedSetup: true,
        profileImage: photoUrl?.secure_url,
        imageId: photoUrl.public_id,
      },
      select: {
        name: true,
        about: true,
        profileImage: true,
        hasCompletedSetup: true,
        firebaseId: true,
        phoneNumber: true,
      },
    });

    return user;
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
    photo?: Express.Multer.File,
  ) {
    if (!id) {
      throw new BadRequestException('User id is required');
    }

    const existingUser = await this.db.user.findUnique({
      where: {
        firebaseId: id,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('No user found');
    }

    let photoUrl: UploadApiResponse | undefined = undefined;

    if (photo && existingUser.profileImage) {
      await this.cloudinary.deleteImage(existingUser.imageId);
    }

    if (photo) {
      photoUrl = await this.cloudinary.uploadImage(photo, {
        folder: 'user_profiles',
        media_type: 'image',
      });
    }

    const user = await this.db.user.update({
      where: {
        firebaseId: id,
      },
      data: {
        about: data.about ?? existingUser.about,
        name: data.name ?? existingUser.name,
        profileImage: photoUrl?.secure_url ?? existingUser.profileImage,
        imageId: photoUrl?.public_id ?? existingUser.imageId,
      },
      select: {
        name: true,
        about: true,
        profileImage: true,
        hasCompletedSetup: true,
        firebaseId: true,
        phoneNumber: true,
      },
    });

    return user;
  }
}
