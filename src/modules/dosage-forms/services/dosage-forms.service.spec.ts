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
            hasProducts: jest.fn(),
        };

        service = new DosageFormsService(mockDosageFormRepo);
    });

    describe('delete', () => {
        it('should throw NotFoundException if dosage form does not exist', async () => {
            mockDosageFormRepo.findById.mockResolvedValue(null);

            await expect(service.delete('non-existent-id')).rejects.toThrow(
                new NotFoundException(MESSAGES.ERROR.NOT_FOUND),
            );
            expect(mockDosageFormRepo.hasProducts).not.toHaveBeenCalled();
            expect(mockDosageFormRepo.delete).not.toHaveBeenCalled();
        });

        it('should throw ConflictException if products reference this dosage form', async () => {
            mockDosageFormRepo.findById.mockResolvedValue({ id: 'form-1', name: 'Tablet' });
            mockDosageFormRepo.hasProducts.mockResolvedValue(true);

            await expect(service.delete('form-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.IN_USE),
            );
            expect(mockDosageFormRepo.delete).not.toHaveBeenCalled();
        });

        it('should delete and return success message when not in use', async () => {
            mockDosageFormRepo.findById.mockResolvedValue({ id: 'form-1', name: 'Tablet' });
            mockDosageFormRepo.hasProducts.mockResolvedValue(false);
            mockDosageFormRepo.delete.mockResolvedValue({ id: 'form-1', deleted_at: new Date() });

            const result = await service.delete('form-1');

            expect(mockDosageFormRepo.delete).toHaveBeenCalledWith('form-1');
            expect(result).toEqual({ message: MESSAGES.SUCCESS.DELETED });
        });
    });
});
