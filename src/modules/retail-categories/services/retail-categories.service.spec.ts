import { ConflictException, NotFoundException } from '@nestjs/common';
import { RetailCategoriesService } from './retail-categories.service';
import { MESSAGES } from '../constants';

describe('RetailCategoriesService', () => {
    let service: RetailCategoriesService;
    let mockRetailCategoriesRepo: any;

    beforeEach(() => {
        mockRetailCategoriesRepo = {
            findById: jest.fn(),
            findByName: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
            hasProducts: jest.fn(),
        };

        service = new RetailCategoriesService(mockRetailCategoriesRepo);
    });

    describe('delete', () => {
        it('should throw NotFoundException if retail category does not exist', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockRetailCategoriesRepo.hasProducts).not.toHaveBeenCalled();
            expect(mockRetailCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this retail category', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'OTC' });
            mockRetailCategoriesRepo.hasProducts.mockResolvedValue(true);

            await expect(service.delete('cat-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockRetailCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when not in use', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'OTC' });
            mockRetailCategoriesRepo.hasProducts.mockResolvedValue(false);
            mockRetailCategoriesRepo.delete.mockResolvedValue({ id: 'cat-1', deleted_at: new Date() });

            const result = await service.delete('cat-1');

            expect(mockRetailCategoriesRepo.delete).toHaveBeenCalledWith('cat-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });
});
