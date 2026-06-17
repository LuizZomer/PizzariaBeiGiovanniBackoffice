import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { IFindAllParam } from 'src/utils/types';
import { messageGenerator, paginate } from 'src/utils/function';

interface IFindAllUser extends IFindAllParam {
  role: string;
}

type TRole = 'admin' | 'employee' | 'financial';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    fullName,
    idnr,
    password,
    role,
    status,
    username,
    function: userFunction,
    workload,
  }: CreateUserDto) {
    if (await this.userNameExist(username))
      throw new BadRequestException('Benutzername existiert bereits!');

    const encryptedPassword = bcrypt.hashSync(password, await bcrypt.genSalt());

    const data: CreateUserDto = {
      fullName,
      idnr,
      password: encryptedPassword,
      role,
      status,
      username,
      function: userFunction,
      workload,
    };

    await this.prisma.user.create({
      data: {
        ...data,
      },
    });

    return messageGenerator('create');
  }

  async findAll({ page, take, search, role }: IFindAllUser) {
    if (page < 1)
      throw new BadRequestException('Seite muss größer als Null sein');

    const where = {
      fullName: { contains: search || undefined },
      role: { equals: role || undefined },
    };

    const select = {
      Finance: false,
      fullName: true,
      id: true,
      createdAt: true,
      function: true,
      idnr: true,
      lastAccess: true,
      password: false,
      Revenue: false,
      role: true,
      status: true,
      updateAt: false,
      username: true,
      workload: true,
    };

    const { data: users, totalPages: usersCount } = await paginate(
      this.prisma.user,
      { where, select, page, take },
    );

    return { users, usersCount };
  }

  async findOne(id: string) {
    await this.exist(id);

    return this.prisma.user.findUnique({
      select: {
        fullName: true,
        createdAt: true,
        function: true,
        id: true,
        idnr: true,
        lastAccess: true,
        role: true,
        status: true,
        username: true,
        workload: true,
      },
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    {
      fullName,
      function: userFunction,
      idnr,
      password,
      role,
      status,
      username,
      workload,
    }: UpdateUserDto,
  ) {
    await this.exist(id);

    const data: UpdateUserDto = {
      fullName,
      function: userFunction,
      idnr,
      role,
      status,
      username,
      workload,
    };

    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = bcrypt.hashSync(password, salt);
    }

    await this.prisma.user.update({
      where: { id },
      data,
    });

    return messageGenerator('update');
  }

  async remove(id: string, userId: string) {
    const forDeleteUser = await this.exist(id);

    if (forDeleteUser.role === 'admin') await this.roleUser('admin');

    if (forDeleteUser.id === userId)
      throw new BadRequestException(
        'Sie können Ihr eigenes Konto nicht löschen',
      );

    await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return messageGenerator('delete');
  }

  async roleUser(role: TRole) {
    const user = await this.prisma.user.count({
      where: {
        role,
      },
    });

    if (user === 1)
      throw new BadRequestException(
        'Muss mindestens einen Superuser enthalten',
      );

    return true;
  }

  async userNameExist(username: string) {
    return this.prisma.user.count({
      where: {
        username,
      },
    });
  }

  async exist(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (user) {
      return user;
    }

    throw new NotFoundException('Id não existente');
  }
}
