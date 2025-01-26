import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BookmarkRecipeCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'RECIPE_ID_REQUIRED' })
  recipeId: string;
}
