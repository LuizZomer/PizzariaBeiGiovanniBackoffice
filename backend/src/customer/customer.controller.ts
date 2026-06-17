import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthCustomerGuard } from 'src/guards/authCustomer.guard';
import { AuthGuard } from 'src/guards/authUser.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { UpdateCustomerInfoDTO } from './dto/update-customer-info.dto';
import { ICustomerReq } from 'src/utils/types';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() customer: CreateCustomerDto) {
    return this.customerService.create(customer);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('take', ParseIntPipe) take: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('search') search: string,
    @Query('status') status: string,
  ) {
    return this.customerService.findAll({ page, take, search, status });
  }

  @UseGuards(AuthCustomerGuard)
  @Get('info')
  findOne(@Req() req: ICustomerReq) {
    const customerId = req.customer.id;
    return this.customerService.findOne(customerId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() customer: UpdateCustomerDto) {
    return this.customerService.update(id, customer);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @UseGuards(AuthCustomerGuard)
  @Patch('info')
  emailAndPassword(@Req() req: ICustomerReq, @Body() payload: UpdateCustomerInfoDTO) {
    const customerId = req.customer.id;
    return this.customerService.updateCustomerInfo(customerId, payload);
  }

  @UseGuards(AuthGuard)
  @Patch('status/:id')
  switchStatus(@Param('id') id: string) {
    return this.customerService.switchStatus(id);
  }
}
