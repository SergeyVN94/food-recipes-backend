import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

import { RecipeIngredientCreateDto } from './recipe-ingredient-create.dto';

export class RecipeUpdateDto {
  @ApiProperty({ type: String, required: true, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150, {
    message: 'TITLE_MAX_LENGTH',
  })
  public title?: string;

  @ApiProperty({ type: String, required: true, maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'DESCRIPTION_MAX_LENGTH',
  })
  public description?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(50, {
    message: 'TAGS_MAX_LENGTH',
  })
  public tags?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(3000, {
    message: 'STEP_MAX_LENGTH',
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'STEPS_MIN_LENGTH',
  })
  @ArrayMaxSize(50, {
    message: 'STEPS_MAX_LENGTH',
  })
  public steps?: string[];

  @ApiProperty({ type: RecipeIngredientCreateDto, isArray: true })
  @IsArray()
  @ArrayMinSize(1, {
    message: 'INGREDIENTS_MIN_LENGTH',
  })
  @ArrayMaxSize(50, {
    message: 'INGREDIENTS_MAX_LENGTH',
  })
  public ingredients: RecipeIngredientCreateDto[];
}
