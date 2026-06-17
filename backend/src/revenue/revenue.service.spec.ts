import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RevenueService } from './revenue.service';

describe('RevenueService', () => {
  let revenueService: RevenueService;
  let prisma: any;
  let financeService: any;
  let customerService: any;

  beforeEach(() => {
    prisma = {
      revenue: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      customer: {
        findUnique: jest.fn(),
      },
    };

    financeService = {
      updateStatusWithRevenue: jest.fn(),
    };

    customerService = {
      incrementLoyaltyPoints: jest.fn(),
    };

    revenueService = new RevenueService(prisma, financeService, customerService);
  });

  it('should throw NotFoundException when the revenue record does not exist', async () => {
    prisma.revenue.findUnique.mockResolvedValue(null);

    await expect(
      revenueService.payRevenue({
        revenueId: 'missing-id',
        orderInfo: { customerId: null, orderInfo: [] },
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when the associated customer does not exist', async () => {
    prisma.revenue.findUnique.mockResolvedValue({ status: false });
    prisma.revenue.update.mockResolvedValue({});
    financeService.updateStatusWithRevenue.mockResolvedValue({});
    prisma.customer.findUnique.mockResolvedValue(null);

    await expect(
      revenueService.payRevenue({
        revenueId: 'existing-id',
        orderInfo: { customerId: 'missing-customer', orderInfo: [] },
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
