import * as bcrypt from 'bcrypt';
import { IOrderInfo } from 'src/revenue/revenue.service';
import { TTypeCheck } from 'src/utils/types';

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

const LOYALTY_POINTS: Record<TTypeCheck, number> = {
  drink: 10,
  noodle: 45,
  pizza: 50,
  salad: 40,
};

export const loyaltyPointsCheck = (orderInfo: IOrderInfo['orderInfo']) => {
  const numberArray = orderInfo.map((o) => LOYALTY_POINTS[o.type] * o.quantity);
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
