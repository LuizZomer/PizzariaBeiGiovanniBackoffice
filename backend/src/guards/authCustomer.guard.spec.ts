import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthCustomerGuard } from './authCustomer.guard';

describe('AuthCustomerGuard', () => {
  let guard: AuthCustomerGuard;
  let authService: { checkCustomerToken: jest.Mock };
  let customerService: { findOne: jest.Mock };

  const createContext = (authorization?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization } }),
      }),
    } as unknown as ExecutionContext);

  beforeEach(() => {
    authService = {
      checkCustomerToken: jest.fn(),
    };

    customerService = {
      findOne: jest.fn(),
    };

    guard = new AuthCustomerGuard(authService as any, customerService as any);
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    await expect(guard.canActivate(createContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    authService.checkCustomerToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(
      guard.canActivate(createContext('Bearer invalid-token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return true and attach customer when token is valid', async () => {
    authService.checkCustomerToken.mockReturnValue({ id: 'customer-id' });
    customerService.findOne.mockResolvedValue({ id: 'customer-id', email: 'test@example.com' });

    const context = createContext('Bearer valid-token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(customerService.findOne).toHaveBeenCalledWith('customer-id');
  });
});
