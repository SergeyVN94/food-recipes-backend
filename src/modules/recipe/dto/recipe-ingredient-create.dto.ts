import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, Min } from 'class-validator';

export class RecipeIngredientCreateDto {
  @ApiProperty()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'COUNT_NOT_NUMBER' },
  )
  public count: number;

  @ApiProperty()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message: 'INGREDIENT_ID_NOT_NUMBER',
    },
  )
  @Min(1)
  public ingredientId: number;

  @ApiProperty()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message: 'AMOUNT_TYPE_ID_NOT_NUMBER',
    },
  )
  @Min(1)
  public amountTypeId: number;
}
