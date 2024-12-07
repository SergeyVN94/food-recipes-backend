import { ApiProperty } from "@nestjs/swagger";

export class UserAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
