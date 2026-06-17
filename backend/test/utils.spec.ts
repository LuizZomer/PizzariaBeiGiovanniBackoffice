import { messageGenerator, loyaltyPointsCheck, paginate } from 'src/utils/function';

describe('messageGenerator', () => {
  it('returns German success message for create', () => {
    expect(messageGenerator('create')).toEqual({ message: 'Erfolgreich erstellt!' });
  });

  it('returns German success message for update', () => {
    expect(messageGenerator('update')).toEqual({ message: 'Erfolgreich aktualisiert!' });
  });

  it('returns German success message for delete', () => {
    expect(messageGenerator('delete')).toEqual({ message: 'Erfolgreich gelöscht!' });
  });
});

describe('loyaltyPointsCheck', () => {
  it('calculates correct points for a single pizza order', () => {
    const points = loyaltyPointsCheck([{ type: 'pizza', quantity: 2 }]);
    expect(points).toBe(100); // 50 pts/pizza × 2
  });

  it('calculates correct points for a mixed order', () => {
    const points = loyaltyPointsCheck([
      { type: 'pizza', quantity: 1 },  // 50
      { type: 'drink', quantity: 3 },  // 30
    ]);
    expect(points).toBe(80);
  });

  it('returns 0 for an empty order', () => {
    expect(loyaltyPointsCheck([])).toBe(0);
  });
});

describe('paginate', () => {
  it('calculates totalPages correctly when records fit exactly', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(20),
      findMany: jest.fn().mockResolvedValue([]),
    };

    const result = await paginate(model, { where: {}, page: 1, take: 10 });

    expect(result.totalPages).toBe(2);
  });

  it('rounds totalPages up when there is a remainder', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(25),
      findMany: jest.fn().mockResolvedValue([{ id: '1' }]),
    };

    const result = await paginate(model, { where: {}, page: 1, take: 10 });

    expect(result.totalPages).toBe(3);
    expect(result.data).toEqual([{ id: '1' }]);
  });

  it('skips the correct number of records based on the page number', async () => {
    const model = {
      count: jest.fn().mockResolvedValue(30),
      findMany: jest.fn().mockResolvedValue([]),
    };

    await paginate(model, { where: {}, page: 3, take: 10 });

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 20, take: 10 }),
    );
  });
});
