import { User, Customer } from '@prisma/client';

export interface IFindAllParam {
  page: number;
  take: number;
  search?: string;
}

export type TTypeCheck = 'pizza' | 'noodle' | 'salad' | 'drink';

export interface IUserReq {
  user: User;
}

export interface ICustomerReq {
  customer: Customer;
}
