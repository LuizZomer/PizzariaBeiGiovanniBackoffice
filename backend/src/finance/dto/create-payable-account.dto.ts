import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FinanceType } from 'src/enums/financeTypes.enum';

export class CreateFinanceDTO {
  @IsString()
  dueDate: string;

  @IsString()
  description: string;

  @IsNumber()
  value: number;

  @IsBoolean()
  status: boolean;

  @IsEnum(FinanceType)
  type: string;

  @IsOptional()
  revenueId: string;
}
