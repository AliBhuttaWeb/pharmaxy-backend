import { ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/client';
import { HoldOrdersService } from './hold-orders.service';
import { MESSAGES } from '../constants';
import { MESSAGES as PRODUCT_MESSAGES } from '@/modules/products/constants/messages.constants';
import { AuthenticatedUser } from '@/modules/auth/types';

describe('HoldOrdersService', () => {
    let service: HoldOrdersService;
    let mockPrisma: any;
    let mockHoldOrdersRepo: any;
    let mockBranchProductsRepo: any;
    let mockProductBatchesRepo: any;
    let mockBranchContextService: any;

    const mockUser: AuthenticatedUser = {
        id: 'user-1',
        email: 'test@example.com',
        phone: null,
        first_name: 'Test',
        last_name: 'User',
        status: 'ACTIVE' as any,
        pharmacy_id: 'pharmacy-1',
        branch_id: 'branch-1',
        is_email_verified: true,
        is_phone_verified: true,
        roles: [{ id: '1', name: 'Cashier' } as any],
    };

    beforeEach(() => {
        mockPrisma = {
            $transaction: jest.fn((cb) => cb('tx')),
        };
        mockHoldOrdersRepo = {
            create: jest.fn(),
            findById: jest.fn(),
            findMany: jest.fn(),
            findLatest: jest.fn(),
            delete: jest.fn(),
            getActiveHeldQuantities: jest.fn().mockResolvedValue({}),
        };
        mockBranchProductsRepo = {
            findById: jest.fn(),
        };
        mockProductBatchesRepo = {
            findAvailableForSale: jest.fn().mockResolvedValue([]),
        };
        mockBranchContextService = {
            get: jest.fn().mockResolvedValue({
                branchId: 'branch-1',
                pharmacyId: 'pharmacy-1',
            }),
        };

        service = new HoldOrdersService(
            mockPrisma,
            mockHoldOrdersRepo,
            mockBranchProductsRepo,
            mockProductBatchesRepo,
            mockBranchContextService,
        );
    });

    describe('create', () => {
        it('should set expires_at 1 hour in the future when creating a hold order', async () => {
            const dto = {
                items: [{ branch_product_id: 'bp-1', quantity: 2 }],
            };

            mockBranchProductsRepo.findById.mockResolvedValue({
                id: 'bp-1',
                branch_id: 'branch-1',
                is_active: true,
                quantity: 10,
                selling_price: new Decimal(100),
            });

            mockProductBatchesRepo.findAvailableForSale.mockResolvedValue([
                { id: 'batch-1', quantity: 10 },
            ]);

            mockHoldOrdersRepo.create.mockImplementation((data: any) => Promise.resolve(data));

            const before = Date.now();
            await service.create(dto as any, mockUser);
            const after = Date.now();

            expect(mockHoldOrdersRepo.create).toHaveBeenCalled();
            const createArg = mockHoldOrdersRepo.create.mock.calls[0][0];
            expect(createArg.expires_at).toBeInstanceOf(Date);
            const expiresAtMs = createArg.expires_at.getTime();
            const oneHourMs = 60 * 60 * 1000;
            expect(expiresAtMs).toBeGreaterThanOrEqual(before + oneHourMs);
            expect(expiresAtMs).toBeLessThanOrEqual(after + oneHourMs + 100);
        });

        it('should throw HELD_STOCK_INSUFFICIENT error when product has active hold orders consuming stock', async () => {
            const dto = {
                items: [{ branch_product_id: 'bp-1', quantity: 2 }],
            };

            mockBranchProductsRepo.findById.mockResolvedValue({
                id: 'bp-1',
                branch_id: 'branch-1',
                is_active: true,
                quantity: 2, // Total 2 in stock
                selling_price: new Decimal(100),
            });

            // 2 already held in unexpired hold orders
            mockHoldOrdersRepo.getActiveHeldQuantities.mockResolvedValue({
                'bp-1': 2,
            });

            await expect(service.create(dto as any, mockUser)).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.HELD_STOCK_INSUFFICIENT),
            );
        });

        it('should throw normal INSUFFICIENT_STOCK error when no orders are on hold and quantity exceeds stock', async () => {
            const dto = {
                items: [{ branch_product_id: 'bp-1', quantity: 5 }],
            };

            mockBranchProductsRepo.findById.mockResolvedValue({
                id: 'bp-1',
                branch_id: 'branch-1',
                is_active: true,
                quantity: 2,
                selling_price: new Decimal(100),
            });

            mockHoldOrdersRepo.getActiveHeldQuantities.mockResolvedValue({
                'bp-1': 0,
            });

            await expect(service.create(dto as any, mockUser)).rejects.toThrow(
                new ConflictException(PRODUCT_MESSAGES.ERROR.INSUFFIENT_STOCK),
            );
        });
    });

    describe('resume', () => {
        it('should throw error when hold order is expired', async () => {
            const expiredOrder = {
                id: 'hold-1',
                expires_at: new Date(Date.now() - 1000), // expired 1s ago
                items: [],
            };

            mockHoldOrdersRepo.findById.mockResolvedValue(expiredOrder);

            await expect(service.resume('hold-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.EXPIRED),
            );
        });

        it('should succeed when hold order is not expired', async () => {
            const activeOrder = {
                id: 'hold-1',
                customer_id: null,
                notes: 'test',
                subtotal: new Decimal(100),
                discount_amount: new Decimal(0),
                tax_amount: new Decimal(0),
                grand_total: new Decimal(100),
                expires_at: new Date(Date.now() + 100000),
                items: [
                    {
                        branch_product_id: 'bp-1',
                        quantity: 1,
                        unit_price: new Decimal(100),
                        subtotal: new Decimal(100),
                        notes: null,
                    },
                ],
            };

            mockHoldOrdersRepo.findById.mockResolvedValue(activeOrder);

            const result = await service.resume('hold-1');
            expect(result.hold_order_id).toBe('hold-1');
            expect(result.items).toHaveLength(1);
            expect(mockHoldOrdersRepo.delete).not.toHaveBeenCalled();
        });
    });

    describe('findMany', () => {
        it('should query orders using user.branch_id resolved from BranchContextService', async () => {
            mockHoldOrdersRepo.findMany.mockResolvedValue({
                records: [{ id: 'hold-1', branch_id: 'branch-1' }],
                total: 1,
            });

            const result = await service.findMany(mockUser, { page: 1, limit: 10 });

            expect(mockBranchContextService.get).toHaveBeenCalledWith(mockUser);
            expect(mockHoldOrdersRepo.findMany).toHaveBeenCalledWith('branch-1', { page: 1, limit: 10 });
            expect(result.records).toHaveLength(1);
        });
    });
});
