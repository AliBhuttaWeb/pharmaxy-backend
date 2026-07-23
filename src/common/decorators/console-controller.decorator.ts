import { Controller } from '@nestjs/common';

import { ROUTES } from '@/common/constants/routes.constants';

export function ConsoleController(path: string) {
    return Controller({
        path: `${ROUTES.CONSOLE}/${path}`,
        version: '1',
    });
}
