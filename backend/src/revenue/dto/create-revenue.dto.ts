import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateRevenueAccountDTO {
  @IsDateString()
  date: string;

  @IsNumber()
  value: number;

  @IsString()
  customerId?: string;

  @IsString()
  customerName?: string;

  @IsString()
  orderId: string;
}
