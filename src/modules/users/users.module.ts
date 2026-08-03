import { Module } from '@nestjs/common';

import { PermissionsModule } from '../permissions/permissions.module';
import { UsersConsoleController } from './controllers/users.console.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';

@Module({
    imports: [PermissionsModule],
    controllers: [UsersConsoleController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
