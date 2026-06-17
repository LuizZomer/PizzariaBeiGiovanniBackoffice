import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class AuthCustomerGuard implements CanActivate {
  private readonly logger = new Logger(AuthCustomerGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers?.authorization as string | undefined;
    const token = authorization?.split(' ')[1] ?? '';

    try {
      const data = this.authService.checkCustomerToken(token);

      req.tokenPayload = data;

      req.customer = await this.customerService.findOne(data.id);

      return true;
    } catch (error) {
      this.logger.error('Token inválido', error?.stack ?? error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
