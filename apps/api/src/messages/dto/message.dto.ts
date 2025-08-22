import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  ArrayNotEmpty,
  ArrayUnique,
  ValidateNested,
  ArrayMinSize,
  IsUUID,
  IsEnum,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

import { Transform, Type } from 'class-transformer';

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

export class ChatParticipantsDTO {
  @IsUUID()
  userId: string;

  @IsEnum(ConversationMemberRole)
  @IsOptional()
  role?: ConversationMemberRole = ConversationMemberRole.MEMBER;
}

export class CreateChatDTO {
  @IsBoolean()
  @IsOptional()
  isGroup?: boolean = false;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @ArrayUnique((participant: ChatParticipantsDTO) => participant.userId)
  @Type(() => ChatParticipantsDTO)
  @ArrayMinSize(1, { message: 'At least one participant is required' })
  participants: ChatParticipantsDTO[];
}

export class CreateMessageDTO extends CreateChatDTO {
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
