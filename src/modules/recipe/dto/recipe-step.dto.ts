import { ApiProperty } from "@nestjs/swagger";

export class RecipeStepDto {
  @ApiProperty()
  content: string;
}