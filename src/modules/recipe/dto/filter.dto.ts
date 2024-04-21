import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString,  } from 'class-validator';

class IngredientsDto {
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  includes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  excludes?: string[];
}

export class RecipesFilterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  q?: string;
  
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  slugs?: string[];

  @ApiProperty()
  
  @IsOptional()
  @Type(() => IngredientsDto)
  ingredients?: IngredientsDto;
}
