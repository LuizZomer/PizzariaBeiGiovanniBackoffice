import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { EnumSizeMenuItem, EnumTypeMenuItem } from '../enums';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  value: number;

  @IsEnum(EnumTypeMenuItem)
  type: EnumTypeMenuItem;

  @IsEnum(EnumSizeMenuItem)
  size: EnumSizeMenuItem;

  @IsBoolean()
  status: boolean;
}
