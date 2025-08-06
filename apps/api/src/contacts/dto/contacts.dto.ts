import {
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, {
    message: 'Phone number must be a valid format',
  })
  phonenumber: string;

  @IsString()
  @IsNotEmpty()
  displayName: string;
}

export class ContactsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one contact is required' })
  @ArrayMaxSize(1000, { message: 'Maximum 1000 contacts allowed per sync' })
  @ValidateNested({ each: true })
  @Type(() => ContactDto)
  contacts: ContactDto[];
}
