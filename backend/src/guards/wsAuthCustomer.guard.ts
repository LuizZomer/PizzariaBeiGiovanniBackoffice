import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WsAuthCustomerGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const token = client.handshake.headers['authorization']?.split(' ')[1];

    if (!token || token === 'null') {
      client.data.customer = null;
      return true;
    }

    const customer = this.authService.checkCustomerToken(token);
    client.data.customer = customer;
    return true;
  }
}
