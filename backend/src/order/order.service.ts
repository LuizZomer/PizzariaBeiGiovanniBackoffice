import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RevenueService } from 'src/revenue/revenue.service';
import { IOrderList } from './order.gateway';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revenueService: RevenueService,
  ) {}

  async createOrder(order: CreateOrderDTO) {
    let value = 0;

    if (!order.OrderItems.length)
      throw new BadRequestException('Warenkorb ist leer!');

    const newOrder = await this.prisma.order.create({
      data: {
        OrderItems: {
          create: order.OrderItems,
        },
        customerName: order.customerName,
        customerId: order.customerId || undefined,
      },
      include: {
        OrderItems: {
          include: {
            Menu: true,
          },
        },
      },
    });

    newOrder.OrderItems.map(({ Menu, quantity }) => {
      value += Menu.value * quantity;
    });

    await this.revenueService.createRevenueAccount({
      date: new Date().toISOString(),
      value,
      orderId: newOrder.id,
      customerName: order.customerName,
      customerId: order.customerId,
    });

    if (order.customerId) {
      await this.prisma.orderLog.create({
        data: {
          customerId: order.customerId,
          orderId: newOrder.id,
        },
      });
    }
  }

  async FindAllOrder({ revenue, sequence }: IOrderList) {
    return this.prisma.order.findMany({
      select: {
        Revenue: {
          select: {
            id: true,
            status: true,
            value: true,
          },
        },
        OrderItems: {
          include: {
            Menu: true,
          },
        },
        customerId: true,
        id: true,
        createdAt: true,
        customerName: true,
      },
      orderBy: {
        createdAt: sequence || undefined,
      },
      where: {
        Revenue: {
          status: revenue ? revenue === 'true' : undefined,
        },
      },
    });
  }
}
