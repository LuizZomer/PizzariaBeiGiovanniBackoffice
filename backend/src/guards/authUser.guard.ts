import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers?.authorization as string | undefined;
    const token = authorization?.split(' ')[1] ?? '';

    try {
      const data = this.authService.checkUserToken(token);

      req.tokenPayload = data;

      req.user = await this.userService.findOne(data.id);

      return true;
    } catch (error) {
      this.logger.error('Token inválido', error?.stack ?? error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
