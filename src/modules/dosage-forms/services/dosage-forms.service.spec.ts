import { ConflictException, NotFoundException } from '@nestjs/common';
import { DosageFormsService } from './dosage-forms.service';
import { MESSAGES } from '../constants';

describe('DosageFormsService', () => {
    let service: DosageFormsService;
    let mockDosageFormRepo: any;

    beforeEach(() => {
        mockDosageFormRepo = {
            findById: jest.fn(),
            findByName: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findMany: jest.fn(),
        };

        mockProductsService = {
            existsByDosageForm: jest.fn(),
        };

        service = new DosageFormsService(mockDosageFormRepo, mockProductsService);
    });

    describe('delete', () => {
        it('should throw NotFoundException if dosage form does not exist', async () => {
            mockDosageFormRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockProductsService.existsByDosageForm).not.toHaveBeenCalled();
            expect(mockDosageFormRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this dosage form', async () => {
            mockDosageFormRepo.findById.mockResolvedValue({ id: 'form-1', name: 'Tablet' });
            mockProductsService.existsByDosageForm.mockResolvedValue(true);

            await expect(service.delete('form-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockDosageFormRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when dosage form exists and not in use', async () => {
            mockDosageFormRepo.findById.mockResolvedValue({ id: 'form-1', name: 'Tablet' });
            mockProductsService.existsByDosageForm.mockResolvedValue(false);
            mockDosageFormRepo.delete.mockResolvedValue({ id: 'form-1', deleted_at: new Date() });

            const result = await service.delete('form-1');

            expect(mockDosageFormRepo.delete).toHaveBeenCalledWith('form-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });

    describe('findById', () => {
        it('should return { dosageForm } when found', async () => {
            const mockForm = { id: 'form-1', name: 'Tablet' };
            mockDosageFormRepo.findById.mockResolvedValue(mockForm);

            const result = await service.findById('form-1');
            expect(result).toEqual({ dosageForm: mockForm });
        });

        it('should throw NotFoundException when not found', async () => {
            mockDosageFormRepo.findById.mockResolvedValue(null);

            await expect(service.findById('non-existent')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
        });
    });

    describe('create', () => {
        it('should return { dosageForm, message } on successful creation', async () => {
            const dto = { name: 'Tablet' };
            const created = { id: 'form-1', name: 'Tablet' };
            mockDosageFormRepo.findByName.mockResolvedValue(null);
            mockDosageFormRepo.create.mockResolvedValue(created);

            const result = await service.create(dto);
            expect(result).toEqual({ dosageForm: created, message: MESSAGES.SUCCESS.CREATED });
        });
    });

    describe('update', () => {
        it('should return { dosageForm, message } on successful update', async () => {
            const dto = { name: 'Capsule' };
            const updated = { id: 'form-1', name: 'Capsule' };
            mockDosageFormRepo.findById.mockResolvedValue({ id: 'form-1', name: 'Tablet' });
            mockDosageFormRepo.findByName.mockResolvedValue(null);
            mockDosageFormRepo.update.mockResolvedValue(updated);

            const result = await service.update('form-1', dto);
            expect(result).toEqual({ dosageForm: updated, message: MESSAGES.SUCCESS.UPDATED });
        });
    });
});
