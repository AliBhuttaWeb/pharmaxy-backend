import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductTypesService } from './product-types.service';
import { MESSAGES } from '../constants';

describe('ProductTypesService', () => {
    let service: ProductTypesService;
    let mockProductTypesRepo: any;

    beforeEach(() => {
        mockProductTypesRepo = {
            findById: jest.fn(),
            findByName: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        };

        mockProductsService = {
            existsByProductType: jest.fn(),
        };

        service = new ProductTypesService(mockProductTypesRepo, mockProductsService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if product type does not exist', async () => {
            mockProductTypesRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsService.existsByProductType).not.toHaveBeenCalled();
            expect(mockProductTypesRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this product type', async () => {
            mockProductTypesRepo.findById.mockResolvedValue({ id: 'type-1', name: 'Pharma' });
            mockProductsService.existsByProductType.mockResolvedValue(true);

            await expect(service.delete('type-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockProductTypesRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when product type exists and not in use', async () => {
            mockProductTypesRepo.findById.mockResolvedValue({ id: 'type-1', name: 'Pharma' });
            mockProductsService.existsByProductType.mockResolvedValue(false);
            mockProductTypesRepo.delete.mockResolvedValue({ id: 'type-1', deleted_at: new Date() });

            const result = await service.delete('type-1');

            expect(mockProductTypesRepo.delete).toHaveBeenCalledWith('type-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('findById', () => {
        it('should return { productType } when found', async () => {
            const mockType = { id: 'type-1', name: 'Pharma' };
            mockProductTypesRepo.findById.mockResolvedValue(mockType);

            const result = await service.findById('type-1');
            expect(result).toEqual({ productType: mockType });
        });

        it('should throw NotFoundException when not found', async () => {
            mockProductTypesRepo.findById.mockResolvedValue(null);

            await expect(service.findById('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should return { productType, message } on successful creation', async () => {
            const dto = { name: 'Pharma' };
            const created = { id: 'type-1', name: 'Pharma' };
            mockProductTypesRepo.findByName.mockResolvedValue(null);
            mockProductTypesRepo.create.mockResolvedValue(created);

            const result = await service.create(dto);
            expect(result).toEqual({ productType: created, message: MESSAGES.SUCCESS.CREATED });
        });
    });

    describe('update', () => {
        it('should return { productType, message } on successful update', async () => {
            const dto = { name: 'Cosmetics' };
            const updated = { id: 'type-1', name: 'Cosmetics' };
            mockProductTypesRepo.findById.mockResolvedValue({ id: 'type-1', name: 'Pharma' });
            mockProductTypesRepo.findByName.mockResolvedValue(null);
            mockProductTypesRepo.update.mockResolvedValue(updated);

            const result = await service.update('type-1', dto);
            expect(result).toEqual({ productType: updated, message: MESSAGES.SUCCESS.UPDATED });
        });
    });
});
