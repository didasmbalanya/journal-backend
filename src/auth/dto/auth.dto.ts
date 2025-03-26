import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    default: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'User password (min 8 chars)',
    default: 'securePassword123',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
