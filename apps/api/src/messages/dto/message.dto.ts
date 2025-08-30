import { PartialType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';

import { Transform } from 'class-transformer';

export enum ConversationMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  STICKER = 'STICKER',
}

export class CreateMessageDTO {
  @IsUUID()
  senderId: string;

  @IsUUID()
  @IsOptional()
  chatId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000, { message: 'Message cannot exceed 4000 characters' })
  @Transform(({ value }) => value?.trim())
  text: string;

  @IsEnum(MediaType)
  @IsOptional()
  mediaType?: MediaType;

  @IsUrl({}, { message: 'Media URL must be a valid URL' })
  @IsOptional()
  mediaUrl?: string;

  @IsString()
  @IsOptional()
  mediaId?: string;

  @IsUUID()
  @IsOptional()
  repliedToId?: string;
}

export class UpdateMessageDTO extends PartialType(CreateMessageDTO) {}

export class GetMessageDTO {
  @IsUUID()
  chatId: string;

  @IsUUID()
  lastMessageId: string;

  @IsNumber()
  limit: number;
}
