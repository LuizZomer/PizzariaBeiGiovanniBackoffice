import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './authUser.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: { checkUserToken: jest.Mock };
  let userService: { findOne: jest.Mock };

  const createContext = (authorization?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ headers: { authorization } }),
      }),
    } as unknown as ExecutionContext);

  beforeEach(() => {
    authService = {
      checkUserToken: jest.fn(),
    };

    userService = {
      findOne: jest.fn(),
    };

    guard = new AuthGuard(authService as any, userService as any);
  });

  it('should throw UnauthorizedException when authorization header is missing', async () => {
    await expect(guard.canActivate(createContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token is invalid', async () => {
    authService.checkUserToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(
      guard.canActivate(createContext('Bearer invalid-token')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return true and attach user when token is valid', async () => {
    authService.checkUserToken.mockReturnValue({ id: 'user-id' });
    userService.findOne.mockResolvedValue({ id: 'user-id', username: 'test' });

    const context = createContext('Bearer valid-token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(userService.findOne).toHaveBeenCalledWith('user-id');
  });
});
