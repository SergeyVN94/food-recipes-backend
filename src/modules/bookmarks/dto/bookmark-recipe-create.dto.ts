import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BookmarkRecipeCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipeId: string;
}
