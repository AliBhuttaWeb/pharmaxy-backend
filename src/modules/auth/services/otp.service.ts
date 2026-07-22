import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/database/prisma/prisma.service';

@Injectable()
export class OtpService {
    constructor(private readonly prisma: PrismaService) {}
}
