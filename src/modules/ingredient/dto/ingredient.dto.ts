import { ApiProperty } from '@nestjs/swagger';
import { AmountTypeDto } from './amount-type.dto';

export class IngredientDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  slug: string;
  
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: true, type: Number, isArray: true })
  amountTypes: number[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updateAt: string;
}
