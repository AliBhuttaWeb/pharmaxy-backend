import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { buildPaginationMeta } from '@/common/pagination';
import { CreatePaymentMethodDto, PaymentMethodQueryDto, UpdatePaymentMethodDto } from '../dtos';
import { PaymentMethodsRepository } from '../repositories/payment-methods.repository';
import { MESSAGES } from '../constants';

@Injectable()
export class PaymentMethodsService {
    constructor(private readonly paymentMethodsRepository: PaymentMethodsRepository) {}

    async findMany(query: PaymentMethodQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.paymentMethodsRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const paymentMethod = await this.paymentMethodsRepository.findById(id);

        if (!paymentMethod) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return paymentMethod;
    }

    async create(dto: CreatePaymentMethodDto) {
        const existingByName = await this.paymentMethodsRepository.findByName(dto.name);
        if (existingByName) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        const existingByCode = await this.paymentMethodsRepository.findByCode(dto.code);
        if (existingByCode) {
            throw new ConflictException(MESSAGES.ERROR.CODE_ALREADY_EXISTS);
        }

        return this.paymentMethodsRepository.create(dto);
    }

    async update(id: string, dto: UpdatePaymentMethodDto) {
        await this.findById(id);

        if (dto.name) {
            const existingByName = await this.paymentMethodsRepository.findByName(dto.name, id);
            if (existingByName) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        if (dto.code) {
            const existingByCode = await this.paymentMethodsRepository.findByCode(dto.code, id);
            if (existingByCode) {
                throw new ConflictException(MESSAGES.ERROR.CODE_ALREADY_EXISTS);
            }
        }

        return this.paymentMethodsRepository.update(id, dto);
    }

    async delete(id: string) {
        await this.findById(id);

        return this.paymentMethodsRepository.delete(id);
    }
}
