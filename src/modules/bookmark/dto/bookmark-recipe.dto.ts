import { ApiProperty } from '@nestjs/swagger';

export class BookmarkRecipeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  recipeId: string;

  @ApiProperty()
  bookmarkId: string;

  @ApiProperty()
  createdAt: string;
}
