import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

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
  @IsStrongPassword({
    minLength: 3,
    minLowercase: 1,
    minUppercase: 1,
  })
  password: string;
}
