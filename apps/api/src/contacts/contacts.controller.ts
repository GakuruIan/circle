import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';

import { Response, Request } from 'express';

import { FirebaseGuardAuth } from '@/firebase/firebase-auth.guard';
import { ContactsService } from './contacts.service';

// contact dto
import { ContactsDto } from './dto/contacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactservice: ContactsService) {}

  @Post('sync')
  @UseGuards(FirebaseGuardAuth)
  async SyncContacts(
    @Body() dto: ContactsDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const contacts = await this.contactservice.SyncContacts(req as any, dto);

    res.status(HttpStatus.OK).send(contacts);
  }

  @Get(':uid')
  @UseGuards(FirebaseGuardAuth)
  async getContacts(@Param('uid') uid: string, @Res() res: Response) {
    const contacts = await this.contactservice.GetContacts(uid);
    res.status(HttpStatus.OK).send(contacts);
  }
}
