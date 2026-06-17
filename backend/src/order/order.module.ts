import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RevenueService } from 'src/revenue/revenue.service';
import { OrderController } from './order.controller';
import { FinanceModule } from 'src/finance/finance.module';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { WsAuthCustomerGuard } from 'src/guards/wsAuthCustomer.guard';

@Module({
  imports: [PrismaModule, FinanceModule, CustomerModule, AuthModule],
  providers: [OrderService, OrderGateway, RevenueService, WsAuthCustomerGuard],
  controllers: [OrderController],
})
export class OrderModule {}
