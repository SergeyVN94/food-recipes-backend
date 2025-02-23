import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class BanCreateDto {
  @ApiProperty({ required: true, description: 'Причина бана' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  public reason: string;

  @ApiProperty({ required: true, description: 'Дата окончания бана в формате ISO' })
  @IsISO8601()
  @IsNotEmpty()
  public endDate: string;
}
