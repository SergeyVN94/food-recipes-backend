import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredientDto } from './recipte-ingredient.dto';
import { RecipeStepDto } from './recipe-step.dto';
import { UserDto } from '@/modules/user/dto/user.dto';

export class RecipeDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public title: string;

  @ApiProperty()
  public slug: string;

  @ApiProperty()
  public description: string;

  @ApiProperty({ type: RecipeIngredientDto, isArray: true })
  public ingredients: RecipeIngredientDto[];

  @ApiProperty()
  public images: string[];

  @ApiProperty({ isArray: true })
  public steps: RecipeStepDto[];

  @ApiProperty()
  public user: UserDto;

  @ApiProperty()
  public isDeleted: boolean;

  @ApiProperty()
  public createdAt: string;

  @ApiProperty()
  public updateAt: string;
}
