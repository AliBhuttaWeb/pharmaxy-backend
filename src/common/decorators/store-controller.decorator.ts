import { Controller } from '@nestjs/common';

import { ROUTES } from '@/common/constants/routes.constants';

export function StoreController(path: string) {
    return Controller({
        path: `${ROUTES.STORE}/${path}`,
        version: '1',
    });
}
