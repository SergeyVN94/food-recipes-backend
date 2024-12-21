import { ApiProperty } from "@nestjs/swagger";

export class RecipeStepDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: string;
}