import { ConflictException } from '@nestjs/common';
import { ReturnStatus } from '@gen/prisma/enums';
import { ReturnsService } from './returns.service';
import { MESSAGES } from '../constants';

describe('ReturnsService', () => {
    let service: ReturnsService;
    let mockPrisma: any;
    let mockReturnsRepo: any;

    beforeEach(() => {
        mockPrisma = {
            $transaction: jest.fn((cb) => cb('tx')),
        };
        mockReturnsRepo = {
            findByIdForCancel: jest.fn(),
            cancel: jest.fn(),
        };

        service = new ReturnsService(
            mockPrisma,
            mockReturnsRepo,
        );
    });

    describe('cancel', () => {
        it('should throw ConflictException when return is completed', async () => {
            mockReturnsRepo.findByIdForCancel.mockResolvedValue({
                id: 'return-1',
                status: ReturnStatus.COMPLETED,
                items: [],
            });

            await expect(service.cancel('return-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.COMPLETED_CANNOT_BE_CANCELLED),
            );
            expect(mockReturnsRepo.cancel).not.toHaveBeenCalled();
        });

        it('should throw ConflictException when return is already cancelled', async () => {
            mockReturnsRepo.findByIdForCancel.mockResolvedValue({
                id: 'return-1',
                status: ReturnStatus.CANCELLED,
                items: [],
            });

            await expect(service.cancel('return-1')).rejects.toThrow(
                new ConflictException(MESSAGES.ERROR.ALREADY_CANCELLED),
            );
            expect(mockReturnsRepo.cancel).not.toHaveBeenCalled();
        });
    });
});
