import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { PayRevenueDTO } from './dto/pay-revenue.dto';
import { AuthGuard } from 'src/guards/authUser.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('revenue')
@UseGuards(AuthGuard, RoleGuard)
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Roles(Role.ADMIN, Role.FINANCIAL)
  @Patch(':revenueId')
  update(
    @Param('revenueId') revenueId: string,
    @Body() orderInfo: PayRevenueDTO,
  ) {
    return this.revenueService.payRevenue({
      revenueId,
      orderInfo,
    });
  }

  @Roles(Role.ADMIN, Role.FINANCIAL)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revenueService.delete(id);
  }
}
