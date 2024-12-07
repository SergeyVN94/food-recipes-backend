import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredientUnitEntity } from '../entity/recipe-ingredient-unit.entity';
import { RecipeStepEntity } from '../entity/recipe-step.entity';

export class RecipeDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public slug: string;

  @ApiProperty()
  public description: string;

  @ApiProperty({ type: RecipeIngredientUnitEntity, isArray: true })
  public ingredients: RecipeIngredientUnitEntity[];

  @ApiProperty()
  public images: string[];

  @ApiProperty({ isArray: true })
  public steps: RecipeStepEntity[];

  @ApiProperty()
  public userId: string;

  @ApiProperty()
  public isDeleted: boolean;

  @ApiProperty()
  public createdAt: string;
  
  @ApiProperty()
  public updateAt: string;
}
