import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  ingredients?: string[];
}