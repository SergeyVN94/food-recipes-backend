import { ApiProperty } from '@nestjs/swagger';

export class BookmarkDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updateAt: string;
}
