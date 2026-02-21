import { Injectable, Req, BadRequestException } from '@nestjs/common';

import * as admin from 'firebase-admin';
import { PrismaService } from '@/prisma/prisma.service';

// contact dto
import { ContactsDto } from './dto/contacts.dto';

type RegisteredUser = {
  id: string;
  phoneNumber: string;
  name: string;
  firebaseId: string;
};

@Injectable()
export class ContactsService {
  constructor(private readonly db: PrismaService) {}

  async SyncContacts(
    @Req() req: Request & { user: admin.auth.DecodedIdToken },
    dto: ContactsDto,
  ) {
    const { uid } = req.user;
    const { contacts } = dto;

    const user = await this.db.user.findUnique({
      where: {
        firebaseId: uid,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new BadRequestException('No user found');
    }

    const phonenumbers = contacts.map((contact) =>
      this.NormalizePhoneNumber(contact.phonenumber),
    );

    const registedUsers = await this.db.user.findMany({
      where: {
        phoneNumber: {
          in: phonenumbers,
        },
        NOT: {
          id: user.id,
        },
      },
      select: {
        id: true,
        phoneNumber: true,
        name: true,
        firebaseId: true,
      },
    });

    const userMap = new Map<string, RegisteredUser>(
      registedUsers.map((user) => [user.phoneNumber, user]),
    );

    const contactsToSync = contacts
      .map((contact) => {
        const normalizedPhone = this.NormalizePhoneNumber(contact.phonenumber);

        const registeredUser = userMap.get(normalizedPhone);

        if (!registeredUser) return null;

        return this.db.contacts.upsert({
          where: {
            userId_contactUserId: {
              userId: user.id,
              contactUserId: registeredUser.id,
            },
          },
          create: {
            userId: user.id,
            contactUserId: registeredUser.id,
            displayName: contact.displayName,
            phonenumber: contact.phonenumber,
          },
          update: {
            displayName: contact.displayName,
            phonenumber: contact.phonenumber,
          },
        });
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    await this.db.$transaction(contactsToSync);

    const contactList = await this.db.contacts.findMany({
      where: {
        userId: user.id,
      },
      include: {
        contactUser: {
          select: {
            phoneNumber: true,
            name: true,
            profileImage: true,
            firebaseId: true,
            about: true,
            id: true,
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
      userUid: contact.contactUser.firebaseId,
      id: contact.contactUser.id,
    }));

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
            id: true,
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
      id: contact.contactUser.id,
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
