import { Module } from '@nestjs/common';

import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { UsersConsoleController } from './controllers/users.console.controller';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { UserBranchesRepository } from './repositories/user-branches.repository';

@Module({
    imports: [PermissionsModule, SubscriptionsModule, RolesModule],
    controllers: [UsersConsoleController],
    providers: [UsersService, UsersRepository, UserBranchesRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule {}
