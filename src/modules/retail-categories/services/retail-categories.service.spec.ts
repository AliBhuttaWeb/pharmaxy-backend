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
        };

        mockProductsService = {
            existsByRetailCategory: jest.fn(),
        };

        service = new RetailCategoriesService(mockRetailCategoriesRepo, mockProductsService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if retail category does not exist', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsService.existsByRetailCategory).not.toHaveBeenCalled();
            expect(mockRetailCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this retail category', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'OTC' });
            mockProductsService.existsByRetailCategory.mockResolvedValue(true);

            await expect(service.delete('cat-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockRetailCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when retail category exists and not in use', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'OTC' });
            mockProductsService.existsByRetailCategory.mockResolvedValue(false);
            mockRetailCategoriesRepo.delete.mockResolvedValue({ id: 'cat-1', deleted_at: new Date() });

            const result = await service.delete('cat-1');

            expect(mockRetailCategoriesRepo.delete).toHaveBeenCalledWith('cat-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('findById', () => {
        it('should return { retailCategory } when found', async () => {
            const mockCategory = { id: 'cat-1', name: 'OTC' };
            mockRetailCategoriesRepo.findById.mockResolvedValue(mockCategory);

            const result = await service.findById('cat-1');
            expect(result).toEqual({ retailCategory: mockCategory });
        });

        it('should throw NotFoundException when not found', async () => {
            mockRetailCategoriesRepo.findById.mockResolvedValue(null);

            await expect(service.findById('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should return { retailCategory, message } on successful creation', async () => {
            const dto = { name: 'OTC' };
            const created = { id: 'cat-1', name: 'OTC' };
            mockRetailCategoriesRepo.findByName.mockResolvedValue(null);
            mockRetailCategoriesRepo.create.mockResolvedValue(created);

            const result = await service.create(dto);
            expect(result).toEqual({ retailCategory: created, message: MESSAGES.SUCCESS.CREATED });
        });
    });

    describe('update', () => {
        it('should return { retailCategory, message } on successful update', async () => {
            const dto = { name: 'Prescription' };
            const updated = { id: 'cat-1', name: 'Prescription' };
            mockRetailCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'OTC' });
            mockRetailCategoriesRepo.findByName.mockResolvedValue(null);
            mockRetailCategoriesRepo.update.mockResolvedValue(updated);

            const result = await service.update('cat-1', dto);
            expect(result).toEqual({ retailCategory: updated, message: MESSAGES.SUCCESS.UPDATED });
        });
    });
});
