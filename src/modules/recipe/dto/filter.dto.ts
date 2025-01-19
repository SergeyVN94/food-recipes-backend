import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

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
  @ApiProperty({
    description: 'Строка поиска по названиям рецептов',
    required: false,
  })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slugs?: string[];

  @ApiProperty({ description: 'id пользователя' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({ description: 'Списки id ингредиентов', required: false })
  @IsOptional()
  @Type(() => IngredientsFilterDto)
  ingredients?: IngredientsFilterDto;

  @ApiProperty({
    description: 'Показать рецепты помеченные удаленными (только для админов!)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
