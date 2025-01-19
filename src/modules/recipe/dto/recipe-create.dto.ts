import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RecipeIngredientCreateDto } from './recipe-ingredient-create.dto';

export class RecipeCreateDto {
  @ApiProperty({ type: String, required: true, maxLength: 150 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150, {
    message: 'TITLE_MAX_LENGTH',
  })
  public title: string;

  @ApiProperty({ type: String, required: true, maxLength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500, {
    message: 'DESCRIPTION_MAX_LENGTH',
  })
  public description: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MaxLength(50, {
    message: 'TAGS_MAX_LENGTH',
  })
  public tags: string[];

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MinLength(1, {
    message: 'STEPS_MIN_LENGTH',
  })
  @MaxLength(50, {
    message: 'STEPS_MAX_LENGTH',
  })
  public steps: string[];

  @ApiProperty({ type: RecipeIngredientCreateDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @MinLength(1, {
    message: 'INGREDIENTS_MIN_LENGTH',
  })
  @MaxLength(50, {
    message: 'INGREDIENTS_MAX_LENGTH',
  })
  public ingredients: RecipeIngredientCreateDto[];
}
