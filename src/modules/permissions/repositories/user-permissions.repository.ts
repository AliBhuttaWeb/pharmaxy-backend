import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class UserPermissionsRepository {
    constructor(private readonly prisma: PrismaService) {}

    findUserPermissions(userId: string) {
        return this.prisma.userPermission.findMany({
            where: {
                user_id: userId,
            },
            select: {
                effect: true,
                permission: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }
}
