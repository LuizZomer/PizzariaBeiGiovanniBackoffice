import { IsString } from 'class-validator';

export class loginUserDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
