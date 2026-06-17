import {
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: any;
  let jwtService: JwtService;

  beforeEach(() => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
      },
      customer: {
        findFirst: jest.fn(),
        create: jest.fn().mockResolvedValue({}),
      },
    };

    jwtService = new JwtService({ secret: 'test-secret' });
    authService = new AuthService(prisma, jwtService);
  });

  describe('userLogin', () => {
    it('throws NotFoundException when no user is found for the given username', async () => {
      prisma.user.findFirst.mockResolvedValue(null);

      await expect(
        authService.userLogin({ username: 'ghost', password: '123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the user account is inactive', async () => {
      prisma.user.findFirst.mockResolvedValue({ status: false, password: 'hash' });

      await expect(
        authService.userLogin({ username: 'inactive', password: '123' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('customerLogin', () => {
    it('throws NotFoundException when no customer is found for the given email', async () => {
      prisma.customer.findFirst.mockResolvedValue(null);

      await expect(
        authService.customerLogin({ email: 'ghost@test.com', password: '123' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when the customer account is inactive', async () => {
      prisma.customer.findFirst.mockResolvedValue({ status: false, password: 'hash' });

      await expect(
        authService.customerLogin({ email: 'inactive@test.com', password: '123' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('isValidUserToken', () => {
    it('returns false for a malformed token', () => {
      expect(authService.isValidUserToken('not.a.valid.token')).toBe(false);
    });

    it('returns true for a token signed by createUserToken', () => {
      const { accessToken } = authService.createUserToken({
        id: 1,
        username: 'admin',
      } as any);

      expect(authService.isValidUserToken(accessToken)).toBe(true);
    });
  });

  describe('isValidCustomerToken', () => {
    it('returns false for a malformed token', () => {
      expect(authService.isValidCustomerToken('not.a.valid.token')).toBe(false);
    });

    it('returns true for a token signed by createCustomerToken', () => {
      const { accessToken } = authService.createCustomerToken({
        id: 1,
        email: 'customer@test.com',
        fullName: 'Test Customer',
      } as any);

      expect(authService.isValidCustomerToken(accessToken)).toBe(true);
    });
  });
});
