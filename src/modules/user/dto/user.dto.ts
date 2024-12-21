import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../types';

export class UserDto {
  @ApiProperty()
  id: string;
  
  @ApiProperty()
  userName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updateAt: string;
}
