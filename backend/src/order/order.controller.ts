import { Controller, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { FindOrderQueryDto } from './dto/find-order-query.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAllOrder(@Query() query: FindOrderQueryDto) {
    return this.orderService.FindAllOrder(query);
  }
}
