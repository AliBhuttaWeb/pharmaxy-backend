import { DashboardService } from './dashboard.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { ROLES } from '@/common/constants';

describe('DashboardService', () => {
    let service: DashboardService;
    let mockDashboardRepo: any;
    let mockBranchContextService: any;
    let mockSubscriptionConstraintService: any;

    beforeEach(() => {
        mockDashboardRepo = {
            overview: jest.fn().mockResolvedValue({ today_sales: 100 }),
        };
        mockBranchContextService = {
            get: jest.fn().mockResolvedValue({
                branchId: 'branch-1',
                pharmacyId: 'pharmacy-1',
            }),
        };
        mockSubscriptionConstraintService = {
            validateReportAccess: jest.fn().mockResolvedValue(undefined),
        };

        service = new DashboardService(
            mockDashboardRepo,
            mockBranchContextService,
            mockSubscriptionConstraintService,
        );
    });

    it('should pass cashierId = undefined to overview when user is Pharmacy Admin', async () => {
        const adminUser: AuthenticatedUser = {
            id: 'admin-user-id',
            email: 'admin@example.com',
            phone: null,
            first_name: 'Admin',
            last_name: 'User',
            status: 'ACTIVE' as any,
            pharmacy_id: 'pharmacy-1',
            branch_id: 'branch-1',
            is_email_verified: true,
            is_phone_verified: true,
            roles: [{ id: '1', name: ROLES.PHARMACY_ADMIN.name } as any],
        };

        await service.overview(adminUser, { days: 7 });

        expect(mockDashboardRepo.overview).toHaveBeenCalledWith('branch-1', 7, undefined);
    });

    it('should pass cashierId = user.id to overview when user is Cashier', async () => {
        const cashierUser: AuthenticatedUser = {
            id: 'cashier-user-id',
            email: 'cashier@example.com',
            phone: null,
            first_name: 'Cashier',
            last_name: 'User',
            status: 'ACTIVE' as any,
            pharmacy_id: 'pharmacy-1',
            branch_id: 'branch-1',
            is_email_verified: true,
            is_phone_verified: true,
            roles: [{ id: '2', name: ROLES.CASHIER.name } as any],
        };

        await service.overview(cashierUser, { days: 7 });

        expect(mockDashboardRepo.overview).toHaveBeenCalledWith('branch-1', 7, 'cashier-user-id');
    });

    it('should pass cashierId = undefined to overview when user is Super Admin', async () => {
        const superAdminUser: AuthenticatedUser = {
            id: 'super-admin-user-id',
            email: 'super@example.com',
            phone: null,
            first_name: 'Super',
            last_name: 'Admin',
            status: 'ACTIVE' as any,
            pharmacy_id: 'pharmacy-1',
            branch_id: 'branch-1',
            is_email_verified: true,
            is_phone_verified: true,
            roles: [{ id: '3', name: ROLES.SUPER_ADMIN.name } as any],
        };

        await service.overview(superAdminUser, { days: 14 });

        expect(mockDashboardRepo.overview).toHaveBeenCalledWith('branch-1', 14, undefined);
    });
});
