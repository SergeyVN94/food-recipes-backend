import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UserRegistryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 3,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    },
    {
      message: 'PASSWORD_NOT_STRONG',
    },
  )
  password: string;
}
