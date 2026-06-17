import { IsEnum, IsOptional } from 'class-validator';

enum RevenueFilter {
  TRUE = 'true',
  FALSE = 'false',
}

enum SortSequence {
  ASC = 'asc',
  DESC = 'desc',
}

export class FindOrderQueryDto {
  @IsOptional()
  @IsEnum(RevenueFilter)
  revenue?: 'true' | 'false';

  @IsOptional()
  @IsEnum(SortSequence)
  sequence?: 'asc' | 'desc';
}
