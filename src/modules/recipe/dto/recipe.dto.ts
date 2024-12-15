import { ApiProperty } from '@nestjs/swagger';
import { RecipeIngredientDto } from './recipte-ingredient.dto';
import { UserDto } from '@/modules/user';

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
  public steps: string[];

  @ApiProperty()
  public user: UserDto;

  @ApiProperty()
  public isDeleted: boolean;

  @ApiProperty()
  public createdAt: string;
  
  @ApiProperty()
  public updateAt: string;
}
