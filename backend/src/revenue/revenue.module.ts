import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FinanceModule } from 'src/finance/finance.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [PrismaModule, FinanceModule, CustomerModule],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule {}
