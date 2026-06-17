import { NotFoundException } from '@nestjs/common';
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
    };

    financeService = {
      updateStatusWithRevenue: jest.fn(),
    };

    customerService = {
      findOne: jest.fn(),
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

  it('should skip loyalty points when the customer is not found', async () => {
    prisma.revenue.findUnique.mockResolvedValue({ status: false });
    prisma.revenue.update.mockResolvedValue({});
    financeService.updateStatusWithRevenue.mockResolvedValue({});
    customerService.findOne.mockResolvedValue(null);

    const result = await revenueService.payRevenue({
      revenueId: 'existing-id',
      orderInfo: { customerId: 'missing-customer', orderInfo: [] },
    });

    expect(result).toEqual({ message: expect.any(String) });
    expect(customerService.incrementLoyaltyPoints).not.toHaveBeenCalled();
  });
});
