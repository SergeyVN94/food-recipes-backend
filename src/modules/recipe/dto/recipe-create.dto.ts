import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { RecipeIngredientCreateDto } from './recipe-ingredient-create.dto';

export class RecipeCreateDto {
  @ApiProperty({ type: String, required: true, maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  public title: string;

  @ApiProperty({ type: String, required: true, maxLength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  public description: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  public tags: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  public steps: string[];

  @ApiProperty({ type: RecipeIngredientCreateDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  public ingredients: RecipeIngredientCreateDto[];
}
