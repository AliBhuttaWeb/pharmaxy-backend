import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { MESSAGES } from '../constants';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto, UpdateUserStatusDto } from '../dtos';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async list(query: FindUsersQueryDto) {
        return this.usersRepository.findMany(query);
    }

    async get(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return user;
    }

    async create(dto: CreateUserDto) {
        const existingEmail = await this.usersRepository.findByEmail(dto.email);

        if (existingEmail) {
            throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
        }

        if (dto.phone) {
            const existingPhone = await this.usersRepository.findByPhone(dto.phone);

            if (existingPhone) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.usersRepository.create({
            ...dto,
            password: hashedPassword,
        });
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.email && dto.email !== user.email) {
            const existingEmail = await this.usersRepository.findByEmail(dto.email);

            if (existingEmail) {
                throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
            }
        }

        if (dto.phone && dto.phone !== user.phone) {
            const existingPhone = await this.usersRepository.findByPhone(dto.phone);

            if (existingPhone) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        return this.usersRepository.update(id, dto);
    }

    async updateStatus(id: string, dto: UpdateUserStatusDto) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return this.usersRepository.update(id, {
            status: dto.status,
        });
    }

    async delete(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return this.usersRepository.delete(id);
    }
}
