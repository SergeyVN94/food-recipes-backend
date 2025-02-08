import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'TITLE_REQUIRED' })
  title: string;
}
