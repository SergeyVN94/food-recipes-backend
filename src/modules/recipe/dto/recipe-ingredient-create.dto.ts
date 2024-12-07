import { ApiProperty } from '@nestjs/swagger';

export class RecipeIngredientCreateDto {
  @ApiProperty()
  public count: number;

  @ApiProperty()
  public ingredientId: string;

  @ApiProperty()
  public amountTypeId: string;
}
