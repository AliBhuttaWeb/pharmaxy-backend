import { PrismaService } from '@/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
    constructor(private readonly prisma: PrismaService) {}

    findById(id: string) {
        return this.prisma.role.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                role_scope: true,
                signup_scope: true,
            },
        });
    }
}
