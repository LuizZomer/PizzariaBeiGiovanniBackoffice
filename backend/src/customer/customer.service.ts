import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFindAllParam } from 'src/utils/types';
import { hashPassword, messageGenerator, paginate } from 'src/utils/function';
import { UpdateCustomerInfoDTO } from './dto/update-customer-info.dto';

interface ICustomerParam extends IFindAllParam {
  status: string;
}

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    email,
    fullName,
    idnr,
    password,
    status,
    loyalty_points,
  }: CreateCustomerDto) {
    await this.existEmail(email);

    await this.prisma.customer.create({
      data: {
        email,
        fullName,
        idnr,
        loyalty_points: loyalty_points || 0,
        status,
        password: await hashPassword(password),
      },
    });

    return messageGenerator('create');
  }

  async findAll({ page, take, search, status }: ICustomerParam) {
    if (page < 1)
      throw new BadRequestException('Seite muss größer als Null sein');

    const where = {
      fullName: { contains: search || undefined },
      status: { equals: status ? status === 'true' : undefined },
    };

    const select = {
      Contact: false,
      createdAt: true,
      email: true,
      fullName: true,
      id: true,
      idnr: true,
      loyalty_points: true,
      Order: false,
      OrderLog: false,
      password: false,
      Revenue: false,
      status: true,
      updateAt: false,
    };

    const { data: customers, totalPages: customersCount } = await paginate(
      this.prisma.customer,
      { where, select, page, take },
    );

    return { customers, customersCount };
  }

  async findOne(id: string) {
    await this.exist(id);

    return this.prisma.customer.findUnique({
      select: {
        loyalty_points: true,
        idnr: true,
        fullName: true,
        email: true,
        id: true,
        OrderLog: {
          select: {
            Order: {
              select: {
                id: true,
                Revenue: {
                  select: {
                    date: true,
                    value: true,
                    status: true,
                  },
                },
                OrderItems: {
                  include: {
                    Menu: {
                      select: {
                        description: true,
                        id: true,
                        name: true,
                        value: true,
                        type: true,
                        size: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: { id },
    });
  }

  async update(
    id: string,
    {
      email,
      fullName,
      idnr,
      loyalty_points,
      password,
      status,
    }: UpdateCustomerDto,
  ) {
    await this.exist(id);

    const customer: UpdateCustomerDto = {
      email,
      fullName,
      idnr,
      loyalty_points,
      status,
    };

    if (password) customer.password = await hashPassword(password);

    await this.prisma.customer.update({ data: customer, where: { id } });

    return messageGenerator('update');
  }

  async incrementLoyaltyPoints({
    id,
    loyalty_points,
  }: {
    id: string;
    loyalty_points: number;
  }) {
    return this.prisma.customer.update({
      data: { loyalty_points: { increment: loyalty_points } },
      where: { id },
    });
  }

  async updateCustomerInfo(id: string, payload: UpdateCustomerInfoDTO) {
    if (payload.password) payload.password = await hashPassword(payload.password);

    await this.prisma.customer.update({ data: payload, where: { id } });

    return messageGenerator('update');
  }

  async remove(id: string) {
    await this.exist(id);

    await this.prisma.customer.delete({ where: { id } });

    return messageGenerator('delete');
  }

  async switchStatus(id: string) {
    const customerStatus = await this.prisma.customer.findFirst({
      select: { status: true },
      where: { id },
    });

    if (!customerStatus) throw new NotFoundException('Kunde nicht gefunden!');

    await this.prisma.customer.update({
      data: { status: !customerStatus.status },
      where: { id },
    });

    return messageGenerator('update');
  }

  async existEmail(email: string) {
    const customer = await this.prisma.customer.count({
      where: { email },
    });

    if (customer) throw new BadRequestException('Vorhandene E-Mail');

    return true;
  }

  async exist(id: string) {
    const customer = await this.prisma.customer.count({ where: { id } });

    if (customer) return true;

    throw new NotFoundException('Id nicht gefunden!');
  }
}
