import { ConflictException, NotFoundException } from '@nestjs/common';
import { ManufacturersService } from './manufacturer.service';
import { MESSAGES } from '../constants';

describe('ManufacturersService', () => {
    let service: ManufacturersService;
    let mockManufacturersRepo: any;

    beforeEach(() => {
        mockManufacturersRepo = {
            findById: jest.fn(),
            findByName: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        };

        mockProductsService = {
            existsByManufacturer: jest.fn(),
        };

        service = new ManufacturersService(mockManufacturersRepo, mockProductsService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if manufacturer does not exist', async () => {
            mockManufacturersRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsService.existsByManufacturer).not.toHaveBeenCalled();
            expect(mockManufacturersRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this manufacturer', async () => {
            mockManufacturersRepo.findById.mockResolvedValue({ id: 'm-1', name: 'GSK' });
            mockProductsService.existsByManufacturer.mockResolvedValue(true);

            await expect(service.delete('m-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockManufacturersRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when manufacturer exists and not in use', async () => {
            mockManufacturersRepo.findById.mockResolvedValue({ id: 'm-1', name: 'GSK' });
            mockProductsService.existsByManufacturer.mockResolvedValue(false);
            mockManufacturersRepo.delete.mockResolvedValue({ id: 'm-1', deleted_at: new Date() });

            const result = await service.delete('m-1');

            expect(mockManufacturersRepo.delete).toHaveBeenCalledWith('m-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('get', () => {
        it('should return { manufacturer } when found', async () => {
            const mockMfg = { id: 'm-1', name: 'GSK' };
            mockManufacturersRepo.findById.mockResolvedValue(mockMfg);

            const result = await service.get('m-1');
            expect(result).toEqual({ manufacturer: mockMfg });
        });

        it('should throw NotFoundException when not found', async () => {
            mockManufacturersRepo.findById.mockResolvedValue(null);

            await expect(service.get('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should return { manufacturer, message } on successful creation', async () => {
            const dto = { name: 'GSK' };
            const created = { id: 'm-1', ...dto };
            mockManufacturersRepo.findByName.mockResolvedValue(null);
            mockManufacturersRepo.create.mockResolvedValue(created);

            const result = await service.create(dto);
            expect(result).toEqual({ manufacturer: created, message: MESSAGES.SUCCESS.CREATED });
        });
    });

    describe('update', () => {
        it('should return { manufacturer, message } on successful update', async () => {
            const dto = { name: 'Pfizer' };
            const updated = { id: 'm-1', ...dto };
            mockManufacturersRepo.findById.mockResolvedValue({ id: 'm-1', name: 'GSK' });
            mockManufacturersRepo.findByName.mockResolvedValue(null);
            mockManufacturersRepo.update.mockResolvedValue(updated);

            const result = await service.update('m-1', dto);
            expect(result).toEqual({ manufacturer: updated, message: MESSAGES.SUCCESS.UPDATED });
        });
    });
});
