# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.1.0] - 2026-06-17

### Added

- **CS-19** — `WsAuthCustomerGuard` implementing `CanActivate` extracted from the order gateway handler, centralizing WebSocket customer token validation in a dedicated guard
- **CS-32** — `existEmail(email, excludeId?)` now accepts an optional `excludeId` to skip self-match, enabling duplicate e-mail validation during customer updates without false positives

### Changed

- **CS-13** — Extracted `markOverdueFinances()` as a separate command in `FinanceService`, applying Command-Query Separation (CQS) so the find method no longer mutates state as a side-effect
- **CS-14** — Introduced a generic `paginate<T>(model, options)` utility in `utils/function.ts` using `Promise.all` for concurrent count + findMany; applied across `FinanceService`, `UserService`, `CustomerService`, and `MenuService`
- **CS-15** — Extracted shared `where` and `select` objects as named variables in all paginated service calls, removing inline duplication
- **CS-16** — Extracted `getTodayRange()` as a private method in `FinanceService`, eliminating repeated date boundary calculations
- **CS-17** — Centralized `hashPassword()` as an async utility in `utils/function.ts` using `bcrypt.genSalt()`; replaced all inline `bcrypt.hashSync` calls across `AuthService`, `UserService`, and `CustomerService`
- **CS-22** — Replaced the `TRole` string alias with the `Role` enum directly in `UserService`, ensuring type safety via the existing enum
- **CS-24** — Replaced the `loyaltyPointsCheck` switch statement with a `LOYALTY_POINTS: Record<TTypeCheck, number>` map constant, simplifying point lookup to a single expression
- **CS-25** — Replaced direct `PrismaService` registration in `providers` with `PrismaModule` imports across `OrderModule`, `UserModule`, `CustomerModule`, `MenuModule`, and `ContactModule`
- **CS-26** — Replaced direct `CustomerService` instantiation in `ContactModule` providers with `CustomerModule` import, respecting NestJS module encapsulation
- **CS-29** — `RevenueService.payRevenue()` now delegates customer lookup to `CustomerService.findOne()` instead of querying `prisma.customer` directly; added `status: true` to `CustomerService.findOne()` select
- **CS-33** — Centralized `IUserReq` and `ICustomerReq` interfaces in `src/utils/types.d.ts`; updated `UserController` and `CustomerController` to import from there, removing local interface duplication
- **CS-35** — Extracted `USER_TOKEN_TTL = '1 days'` and `CUSTOMER_TOKEN_TTL = '3 days'` as module-level constants in `AuthService`, replacing inline magic strings in `createUserToken` and `createCustomerToken`

### Removed

- **CS-30** — Deleted dead methods `findAllRevenue()` and `deleteAll()` from `RevenueService` that were never called by any controller or service
- **CS-31** — Deleted unused `UpdateRevenueDto` file from `src/revenue/dto/`

### Fixed

- **CS-05** — `switchStatus` now throws `NotFoundException` when the target record does not exist instead of silently doing nothing
- **CS-06** — `payRevenue` now validates that the revenue record exists before toggling payment status, throwing `NotFoundException` on missing IDs
- **CS-09** — WebSocket error responses in the order gateway no longer expose internal exception objects; errors are now serialized as plain messages
- **CS-10** — Revenue creation DTO now uses `@IsDateString()` instead of `@IsString()` for the `date` field, aligning validation with the expected type
- **CS-11** — Fixed `ContactType` enum value `emial` typo corrected to `email`
- **CS-12** — Renamed DTO files that had been created with ` copy` suffixes to their canonical names
- **CS-18** — Removed duplicate `checkCustomerToken` call in the order gateway that was being invoked twice per connection
- **CS-20** — Replaced `req: any` with typed `IUserReq` in `FinanceController` request parameters
- **CS-21** — DTO string fields that map to enums now use explicit enum types with `@IsEnum()` validation instead of plain `string`
- **CS-23** — Standardized all error messages to German across `AuthService`, `CustomerService`, `UserService`, `MenuService`, `OrderService`, `FinanceService`, and `RevenueService`; removed residual Portuguese messages
- **CS-27** — Added `FindOrderQueryDto` with `@IsEnum` validation for `revenue` and `sequence` query parameters in `OrderController`
- **CS-28** — Added `FindFinanceQueryDto` with `@IsDateString()`, `@IsInt()`, and `@IsEnum()` validation for finance query parameters; enabled `ValidationPipe({ transform: true })` globally in `main.ts`

### Security

- **CS-01** — JWT secret moved from hardcoded string to `process.env.JWT_SECRET`, preventing credential exposure in source control
- **CS-02** — Revenue routes now protected with `AuthGuard` and `RoleGuard`, preventing unauthenticated access
- **CS-04** — CORS `origin` restricted to `allowedOrigins` list derived from `process.env.FRONT_URL`, blocking arbitrary cross-origin requests
- **CS-07** — Auth guards now throw `UnauthorizedException` on invalid tokens instead of allowing the request to pass through silently
- **CS-08** — Missing or malformed `Authorization` header in guards is now handled explicitly, returning an unauthorized response instead of throwing an unhandled error

## [1.0.0] - 2025-01-01

### Added

- Initial release: NestJS backend with authentication, customer management, menu CRUD, order WebSocket gateway, finance module, and revenue tracking for Pizzaria Bei Giovanni
