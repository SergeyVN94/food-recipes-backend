import { ApiProperty } from "@nestjs/swagger";

export class RecipeIngredientDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public count: number;

  @ApiProperty()
  public ingredientId: number;

  @ApiProperty()
  public amountTypeId: number;

  @ApiProperty()
  public createdAt: string;
}