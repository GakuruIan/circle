import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateUserDto {
  // @IsString()
  // firebaseId: string;

  // @IsString()
  // phoneNumber: string;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  about: string;

  // @IsOptional()
  // @IsString()
  // profileImage?: string;

  // @IsOptional()
  // @IsString()
  // imageId?: string;
}

export class UpdateUserDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}
