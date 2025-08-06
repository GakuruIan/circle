import { Injectable, Req, BadRequestException } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { PrismaService } from '@/prisma/prisma.service';

// contact dto
import { ContactsDto } from './dto/contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly db: PrismaService) {}

  async SyncContacts(
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
    dto: ContactsDto,
  ) {
    const { uid } = req.user;
    const { contacts } = dto;

    if (!uid) {
      throw new BadRequestException('Invalid Firebase token');
    }

    const phonenumbers = contacts.map((contact) =>
      this.NormalizePhoneNumber(contact.phonenumber),
    );

    console.log(phonenumbers);

    const registedUsers = await this.db.user.findMany({
      where: { phoneNumber: { in: phonenumbers }, NOT: { firebaseId: uid } },
      select: {
        phoneNumber: true,
        name: true,
        firebaseId: true,
      },
    });

    const userMap = new Map(
      registedUsers.map((user) => [user.phoneNumber, user]),
    );

    const contactsToSync = contacts
      .map((contact) => {
        const normalizedPhone = this.NormalizePhoneNumber(contact.phonenumber);
        const registedUser = userMap.get(normalizedPhone);
        if (!registedUser) return null;

        return this.db.contacts.upsert({
          where: {
            userId_contactUserId: {
              userId: uid,
              contactUserId: registedUser.firebaseId,
            },
          },
          create: {
            userId: uid,
            contactUserId: registedUser.firebaseId,
            displayName: contact.displayName,
            phonenumber: contact.phonenumber,
          },
          update: {
            displayName: contact.displayName,
            phonenumber: contact.phonenumber,
          },
        });
      })
      .filter(Boolean);

    await this.db.$transaction(contactsToSync);

    const contactList = await this.db.contacts.findMany({
      where: {
        userId: uid,
      },
      include: {
        contactUser: {
          select: {
            phoneNumber: true,
            name: true,
            profileImage: true,
            firebaseId: true,
            about: true,
          },
        },
      },
    });

    const UserContacts = contactList.map((contact) => ({
      displayName: contact.displayName,
      name: contact.contactUser.name,
      about: contact.contactUser.about,
      profileImage: contact.contactUser.profileImage,
      phonenumber: contact.contactUser.phoneNumber,
      userId: contact.contactUser.firebaseId,
    }));

    console.log(UserContacts);

    return UserContacts;
  }

  async GetContacts(uid: string) {
    if (!uid) {
      throw new BadRequestException('User id is required');
    }

    const existingUser = await this.db.user.findUnique({
      where: {
        firebaseId: uid,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('No user found');
    }

    const contacts = await this.db.contacts.findMany({
      where: {
        userId: uid,
      },
      include: {
        contactUser: {
          select: {
            phoneNumber: true,
            name: true,
            profileImage: true,
            firebaseId: true,
            about: true,
          },
        },
      },
    });

    const UserContacts = contacts.map((contact) => ({
      contactName: contact.displayName,
      actualName: contact.contactUser.name,
      about: contact.contactUser.about,
      profileImage: contact.contactUser.profileImage,
      phoneNumber: contact.contactUser.phoneNumber,
      userUid: contact.contactUser.firebaseId,
    }));

    return UserContacts;
  }

  private NormalizePhoneNumber(phonenumber: string): string {
    phonenumber = phonenumber.trim();

    if (phonenumber.startsWith('+')) {
      return '+' + phonenumber.slice(1).replace(/\D/g, '');
    }
    return phonenumber.replace(/\D/g, '');
  }
}
