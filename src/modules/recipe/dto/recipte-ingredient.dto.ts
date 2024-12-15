import { ApiProperty } from "@nestjs/swagger";

export class RecipeIngredientDto {
  @ApiProperty()
  public count: number;

  @ApiProperty()
  public ingredientId: string;

  @ApiProperty()
  public amountTypeId: string;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updateAt: string;
}