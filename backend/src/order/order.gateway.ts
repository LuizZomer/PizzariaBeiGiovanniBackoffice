import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { WsAuthCustomerGuard } from 'src/guards/wsAuthCustomer.guard';

export interface IOrderList {
  sequence?: 'asc' | 'desc';
  revenue?: 'true' | 'false';
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : process.env.NODE_ENV === 'development'
    ? '*'
    : [];

@WebSocketGateway({
  namespace: 'order',
  cors: {
    origin: allowedOrigins,
  },
})
export class OrderGateway {
  private readonly logger = new Logger(OrderGateway.name);

  constructor(private readonly orderService: OrderService) {}

  @WebSocketServer() server: Server;

  @UseGuards(WsAuthCustomerGuard)
  @SubscribeMessage('newOrder')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handleNewOrder(
    @MessageBody() order: CreateOrderDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const customer = client.data.customer;

    if (customer) {
      order.customerName = customer.name;
      order.customerId = customer.id;
    }

    try {
      await this.orderService.createOrder(order);
      this.server.emit('newOrderList');
      client.emit('newOrderResponse', { success: true });
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro interno ao criar pedido';
      this.logger.error('Falha ao criar pedido via WebSocket', e instanceof Error ? e.stack : e);
      client.emit('newOrderResponse', { success: false, message });
    }
  }
}
