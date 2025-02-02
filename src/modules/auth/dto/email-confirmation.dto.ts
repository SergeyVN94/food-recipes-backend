import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailConfirmationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
