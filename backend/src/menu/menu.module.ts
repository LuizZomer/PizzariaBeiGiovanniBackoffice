import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
