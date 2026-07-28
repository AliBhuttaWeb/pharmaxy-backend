import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { APP } from '@/common/constants';

export const SwaggerBearerAuth = () => applyDecorators(ApiBearerAuth(APP.SWAGGER.AUTH_NAME));
