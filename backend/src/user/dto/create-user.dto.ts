import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsString()
  username: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @IsString()
  @IsOptional()
  function?: string;

  @IsString()
  @Length(11)
  idnr: string;

  @IsEnum(Role)
  role: Role;

  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  workload?: string;
}
