import { ConflictException, NotFoundException } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { MESSAGES } from '../constants/messages.constants';

describe('BranchesService', () => {
    let service: BranchesService;
    let mockBranchesRepo: any;
    let mockSubscriptionConstraintService: any;

    beforeEach(() => {
        mockBranchesRepo = {
            findById: jest.fn(),
            delete: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            countByPharmacyId: jest.fn(),
            findByName: jest.fn(),
            findMainBranch: jest.fn(),
            updateStatus: jest.fn(),
        };

        mockSubscriptionConstraintService = {
            validateBranchesLimit: jest.fn(),
        };

        service = new BranchesService(mockBranchesRepo, mockSubscriptionConstraintService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if branch does not exist', async () => {
            mockBranchesRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockBranchesRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if trying to delete the main branch', async () => {
            mockBranchesRepo.findById.mockResolvedValue({
                id: 'branch-1',
                name: 'Main Branch',
                is_main: true,
            });

            await expect(service.delete('branch-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.CANNOT_DELETE_MAIN_BRANCH),
            );
            expect(mockBranchesRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when branch is not main branch', async () => {
            mockBranchesRepo.findById.mockResolvedValue({
                id: 'branch-2',
                name: 'Secondary Branch',
                is_main: false,
            });
            mockBranchesRepo.delete.mockResolvedValue({ id: 'branch-2', deleted_at: new Date() });

            const result = await service.delete('branch-2');

            expect(mockBranchesRepo.delete).toHaveBeenCalledWith('branch-2');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });
});
