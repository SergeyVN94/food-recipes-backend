import { ApiProperty } from '@nestjs/swagger';

export class RecipeDto {
  @ApiProperty()
  public title: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public tags: string[];

  @ApiProperty()
  public images: string[];

  @ApiProperty()
  public steps: string[];
}
