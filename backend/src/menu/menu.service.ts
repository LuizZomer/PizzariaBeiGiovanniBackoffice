import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFindAllParam } from 'src/utils/types';
import { messageGenerator } from 'src/utils/function';

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

    const menuCount = await this.prisma.menu.count({
      where: {
        name: {
          contains: search || undefined,
        },
        size: {
          equals: size || undefined,
        },
        type: {
          equals: type || undefined,
        },
        status: status ? status === 'true' : undefined,
      },
    });

    const count = Math.ceil(menuCount / take);

    const menuItens = await this.prisma.menu.findMany({
      select: {
        id: true,
        description: true,
        name: true,
        OrderItems: false,
        size: true,
        type: true,
        value: true,
        status: true,
      },
      skip: (page - 1) * take,
      take,
      where: {
        name: {
          contains: search || undefined,
        },
        size: {
          equals: size || undefined,
        },
        type: {
          equals: type || undefined,
        },
        status: status ? status === 'true' : undefined,
      },
    });

    return { menuItens, itensCount: count };
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

    if (!menuStatus) {
      throw new NotFoundException('Item de menu não encontrado');
    }

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

    throw new NotFoundException('Id não existente');
  }
}
