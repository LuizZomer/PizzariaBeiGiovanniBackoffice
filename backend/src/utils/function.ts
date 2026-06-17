import * as bcrypt from 'bcrypt';
import { IOrderInfo } from 'src/revenue/revenue.service';

type IMessageType = 'create' | 'update' | 'delete';

export const messageGenerator = (msgType: IMessageType) => {
  switch (msgType) {
    case 'create':
      return { message: 'Erfolgreich erstellt!' };
    case 'delete':
      return { message: 'Erfolgreich gelöscht!' };
    case 'update':
      return { message: 'Erfolgreich aktualisiert!' };
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, await bcrypt.genSalt());
};

export const loyaltyPointsCheck = (orderInfo: IOrderInfo['orderInfo']) => {
  const numberArray = orderInfo.map((o) => {
    switch (o.type) {
      case 'drink':
        return 10 * o.quantity;
      case 'noodle':
        return 45 * o.quantity;
      case 'pizza':
        return 50 * o.quantity;
      case 'salad':
        return 40 * o.quantity;
    }
  });

  return numberArray.reduce((total, actual) => total + actual, 0);
};

interface PaginatableModel {
  count: (args?: any) => Promise<number>;
  findMany: (args?: any) => Promise<any[]>;
}

export async function paginate<T>(
  model: PaginatableModel,
  options: { where: any; select?: any; page: number; take: number },
): Promise<{ data: T[]; totalPages: number }> {
  const [total, data] = await Promise.all([
    model.count({ where: options.where }),
    model.findMany({
      where: options.where,
      ...(options.select !== undefined ? { select: options.select } : {}),
      take: options.take,
      skip: (options.page - 1) * options.take,
    }),
  ]);
  return { data, totalPages: Math.ceil(total / options.take) };
}
