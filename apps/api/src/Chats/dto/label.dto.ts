import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLabelDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class EditLabelDTO extends PartialType(CreateLabelDTO) {}
