import { ApiProperty } from '@nestjs/swagger';
import { AmountTypeDto } from './amount-type.dto';

export class RecipeIngredientDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  slug: string;
  
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: true, type: AmountTypeDto, isArray: true })
  amountTypes: AmountTypeDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updateAt: string;
}
