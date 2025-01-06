import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RecipeCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public tags: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public images: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  public steps: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  public ingredients: string[];
}
