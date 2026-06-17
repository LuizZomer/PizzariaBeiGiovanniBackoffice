import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [PrismaModule, CustomerModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
