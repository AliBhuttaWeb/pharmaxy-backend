import { Injectable } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    findById(id: string) {
        return this.rolesRepository.findById(id);
    }
}
