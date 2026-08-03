import { Module } from '@nestjs/common';

import { UsersConsoleController } from './controllers/users.console.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { PermissionResolverService } from '../permissions/services/permissions-resolver.service';

@Module({
    controllers: [UsersConsoleController],
    providers: [UsersService, UsersRepository, PermissionResolverService],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
