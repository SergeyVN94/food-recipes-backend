import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecipeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsArray()
  public tags: string[];

  @ApiProperty()
  @IsOptional()
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
  public ingredientsUnits: string[];
}
