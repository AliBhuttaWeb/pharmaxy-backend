import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MESSAGES } from '../constants';

describe('CategoriesService', () => {
    let service: CategoriesService;
    let mockCategoriesRepo: any;
    let mockProductsService: any;

    beforeEach(() => {
        mockCategoriesRepo = {
            findById: jest.fn(),
            findByName: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        };

        mockProductsService = {
            existsByCategory: jest.fn(),
        };

        service = new CategoriesService(mockCategoriesRepo, mockProductsService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if category does not exist', async () => {
            mockCategoriesRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsService.existsByCategory).not.toHaveBeenCalled();
            expect(mockCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this category', async () => {
            mockCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'Medicines' });
            mockProductsService.existsByCategory.mockResolvedValue(true);

            await expect(service.delete('cat-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockCategoriesRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when category exists and not in use', async () => {
            mockCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'Medicines' });
            mockProductsService.existsByCategory.mockResolvedValue(false);
            mockCategoriesRepo.delete.mockResolvedValue({
                id: 'cat-1',
                deleted_at: new Date(),
            });

            const result = await service.delete('cat-1');

            expect(mockCategoriesRepo.delete).toHaveBeenCalledWith('cat-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('findById', () => {
        it('should return { category } when found', async () => {
            const mockCategory = { id: 'cat-1', name: 'Medicines' };
            mockCategoriesRepo.findById.mockResolvedValue(mockCategory);

            const result = await service.findById('cat-1');
            expect(result).toEqual({ category: mockCategory });
        });

        it('should throw NotFoundException when not found', async () => {
            mockCategoriesRepo.findById.mockResolvedValue(null);

            await expect(service.findById('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should return { category, message } on successful creation', async () => {
            const dto = { name: 'Medicines' };
            const created = { id: 'cat-1', name: 'Medicines' };
            mockCategoriesRepo.findByName.mockResolvedValue(null);
            mockCategoriesRepo.create.mockResolvedValue(created);

            const result = await service.create(dto);
            expect(result).toEqual({ category: created, message: MESSAGES.SUCCESS.CREATED });
        });
    });

    describe('update', () => {
        it('should return { category, message } on successful update', async () => {
            const dto = { name: 'Prescription' };
            const updated = { id: 'cat-1', name: 'Prescription' };
            mockCategoriesRepo.findById.mockResolvedValue({ id: 'cat-1', name: 'Medicines' });
            mockCategoriesRepo.findByName.mockResolvedValue(null);
            mockCategoriesRepo.update.mockResolvedValue(updated);

            const result = await service.update('cat-1', dto);
            expect(result).toEqual({ category: updated, message: MESSAGES.SUCCESS.UPDATED });
        });
    });
});
