import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString, Min } from 'class-validator';

export class RecipeIngredientCreateDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  public count: number;

  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1)
  public ingredientId: number;

  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1)
  public amountTypeId: number;
}
