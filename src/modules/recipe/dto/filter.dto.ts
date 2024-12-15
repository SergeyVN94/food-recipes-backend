import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

class IngredientsFilterDto {
  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includes?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludes?: string[];
}

export class RecipesFilterDto {
  @ApiProperty({ description: 'Строка поиска по названиям рецептов', required: false })
  @IsString()
  @IsOptional()
  q?: string;
  
  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slugs?: string[];

  @ApiProperty({ description: 'Списки id ингредиентов', required: false })
  @IsOptional()
  @Type(() => IngredientsFilterDto)
  ingredients?: IngredientsFilterDto;
}
