import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderGateway } from './order.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { OrderController } from './order.controller';
import { FinanceModule } from 'src/finance/finance.module';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { WsAuthCustomerGuard } from 'src/guards/wsAuthCustomer.guard';

@Module({
  imports: [FinanceModule, CustomerModule, AuthModule],
  providers: [OrderService, OrderGateway, PrismaService, RevenueService, WsAuthCustomerGuard],
  controllers: [OrderController],
})
export class OrderModule {}
