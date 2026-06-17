import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { loginUserDTO } from './dto/login-user.dto';
import { loginCustomerDTO } from './dto/login-customer';
import { customerRegisterDTO } from './dto/customer-register.dto';
import { hashPassword, messageGenerator } from 'src/utils/function';

@Injectable()
export class AuthService {
  private user = {
    issuer: 'userLogin',
    audience: 'user',
  };

  private customer = {
    issuer: 'customerLogin',
    audience: 'customer',
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  createUserToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          username: user.username,
        },
        {
          expiresIn: '1 days',
          subject: String(user.id),
          issuer: this.user.issuer,
          audience: this.user.audience,
        },
      ),
    };
  }

  checkUserToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.user.issuer,
        audience: this.user.audience,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidUserToken(token: string) {
    try {
      this.checkUserToken(token);

      return true;
    } catch {
      return false;
    }
  }

  async userLogin({ password, username }: loginUserDTO) {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!user) throw new NotFoundException('E-Mail und/oder Passwort falsch!');

    if (!user.status)
      throw new ForbiddenException(
        'Keine Berechtigung zum Zugriff auf das System!',
      );

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('E-Mail und/oder Passwort falsch!');

    await this.prisma.user.update({
      data: {
        lastAccess: new Date(),
      },
      where: {
        id: user.id,
      },
    });

    return this.createUserToken(user);
  }

  createCustomerToken(customer: Customer) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: customer.id,
          email: customer.email,
          name: customer.fullName,
        },
        {
          expiresIn: '3 days',
          subject: String(customer.id),
          issuer: this.customer.issuer,
          audience: this.customer.audience,
        },
      ),
    };
  }

  checkCustomerToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.customer.issuer,
        audience: this.customer.audience,
      });

      return data;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  isValidCustomerToken(token: string) {
    try {
      this.checkCustomerToken(token);

      return true;
    } catch {
      return false;
    }
  }

  async customerLogin({ password, email }: loginCustomerDTO) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email,
      },
    });

    if (!customer)
      throw new NotFoundException('E-Mail und/oder Passwort falsch!');

    if (!customer.status)
      throw new ForbiddenException(
        'Keine Berechtigung zum Zugriff auf das System!',
      );

    if (!(await bcrypt.compare(password, customer.password)))
      throw new UnauthorizedException('E-Mail und/oder Passwort falsch!');

    return this.createCustomerToken(customer);
  }

  async customerRegister(customer: customerRegisterDTO) {
    await this.prisma.customer.create({
      data: {
        ...customer,
        password: await hashPassword(customer.password),
        loyalty_points: 0,
        status: true,
      },
    });

    return messageGenerator('create');
  }
}
