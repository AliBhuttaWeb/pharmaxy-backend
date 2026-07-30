import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import { CreateManufacturerDto, FindManufacturersQueryDto, UpdateManufacturerDto } from '../dtos';
import { ManufacturersRepository } from '../repositories/manufacturers.repository';

@Injectable()
export class ManufacturersService {
    constructor(private readonly manufacturersRepository: ManufacturersRepository) {}

    async list(query: FindManufacturersQueryDto) {
        return this.manufacturersRepository.findMany(query);
    }

    async get(id: string) {
        const manufacturer = await this.manufacturersRepository.findById(id);

        if (!manufacturer) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return manufacturer;
    }

    async create(dto: CreateManufacturerDto) {
        const existingManufacturer = await this.manufacturersRepository.findByName(dto.name);

        if (existingManufacturer) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        await this.manufacturersRepository.create(dto);

        return {
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateManufacturerDto) {
        const manufacturer = await this.manufacturersRepository.findById(id);

        if (!manufacturer) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.name && dto.name !== manufacturer.name) {
            const existingManufacturer = await this.manufacturersRepository.findByName(dto.name);

            if (existingManufacturer && existingManufacturer.id !== id) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        await this.manufacturersRepository.update(id, dto);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async delete(id: string) {
        const manufacturer = await this.manufacturersRepository.findById(id);

        if (!manufacturer) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.manufacturersRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }
}
