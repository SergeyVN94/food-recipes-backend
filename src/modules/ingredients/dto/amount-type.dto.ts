import { ApiProperty } from '@nestjs/swagger';

export class AmountTypeDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  slug: string;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  createdAt: string;

  @ApiProperty({ required: true })
  updateAt: string;
}
