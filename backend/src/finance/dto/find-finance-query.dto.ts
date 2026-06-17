import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { FinanceType } from 'src/enums/financeTypes.enum';

enum StatusFilter {
  TRUE = 'true',
  FALSE = 'false',
}

export class FindFinanceQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  take: number;

  @IsOptional()
  @IsEnum(StatusFilter)
  status?: string;

  @IsOptional()
  @IsEnum(FinanceType)
  type?: string;

  @IsOptional()
  @IsDateString()
  initialDate?: string;

  @IsOptional()
  @IsDateString()
  finalDate?: string;
}
