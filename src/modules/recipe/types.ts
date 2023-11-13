// import { RecipeIngredient } from 'src/modules/recipe-ingredient';

import { ApiProperty } from "@nestjs/swagger";

export type RecipeFilter = {
  query?: string;
  slugs?: string[];
};

export class Recipe {
  @ApiProperty()
  public id: string;
  
  @ApiProperty()
  public title: string;
  
  @ApiProperty()
  public slug: string;
  
  @ApiProperty()
  public description: string;
  
  @ApiProperty({ type: String, isArray: true })
  public ingredients: string[];
  
  @ApiProperty()
  public images: string;
  
  @ApiProperty({ type: String, isArray: true })
  public steps: [];
  
  @ApiProperty()
  public createdAt: string;
  
  @ApiProperty()
  public updateAt: string;
}
