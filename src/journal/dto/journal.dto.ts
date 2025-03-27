import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Content must be at least 20 characters long.' })
  @MaxLength(10000, { message: 'Content cannot exceed 10,000 characters.' })
  content: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateJournalDto extends PartialType(CreateJournalDto) {}
