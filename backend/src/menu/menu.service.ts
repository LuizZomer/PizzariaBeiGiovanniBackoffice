import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFindAllParam } from 'src/utils/types';
import { messageGenerator, paginate } from 'src/utils/function';

interface IMenuParam extends IFindAllParam {
  search: string;
  size: string;
  type: string;
  status: string;
}

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(item: CreateMenuDto) {
    await this.prisma.menu.create({
      data: item,
    });

    return messageGenerator('create');
  }

  async findAll({ page, take, search, size, type, status }: IMenuParam) {
    if (page < 1)
      throw new BadRequestException('Seite muss größer als Null sein');

    const where = {
      name: { contains: search || undefined },
      size: { equals: size || undefined },
      type: { equals: type || undefined },
      status: status ? status === 'true' : undefined,
    };

    const select = {
      id: true,
      description: true,
      name: true,
      OrderItems: false,
      size: true,
      type: true,
      value: true,
      status: true,
    };

    const { data: menuItens, totalPages: itensCount } = await paginate(
      this.prisma.menu,
      { where, select, page, take },
    );

    return { menuItens, itensCount };
  }

  async findOne(id: string) {
    await this.exist(id);

    return this.prisma.menu.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, item: UpdateMenuDto) {
    await this.exist(id);

    await this.prisma.menu.update({
      where: { id },
      data: item,
    });

    return messageGenerator('update');
  }

  async remove(id: string) {
    await this.exist(id);

    await this.prisma.menu.delete({
      where: {
        id,
      },
    });

    return messageGenerator('delete');
  }

  async switchStatus(id: string) {
    const menuStatus = await this.prisma.menu.findFirst({
      select: {
        status: true,
      },
      where: {
        id,
      },
    });

    if (!menuStatus) throw new NotFoundException('Menüpunkt nicht gefunden!');

    await this.prisma.menu.update({
      data: {
        status: !menuStatus.status,
      },
      where: {
        id,
      },
    });

    return messageGenerator('update');
  }

  async exist(id: string) {
    const user = await this.prisma.menu.count({
      where: {
        id,
      },
    });

    if (user) {
      return true;
    }

    throw new NotFoundException('Id nicht gefunden!');
  }
}
