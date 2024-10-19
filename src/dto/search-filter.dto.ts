import { ApiProperty } from '@nestjs/swagger';

export class SearchFilterDto {
  @ApiProperty({ description: 'Строка для поиска' })
  q: string; 
}
