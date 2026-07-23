import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { MESSAGES } from '@/common/constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();

        const isDevelopment = this.configService.getOrThrow<string>('app.env') === 'development';

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        let message = MESSAGES.COMMON.ERROR.INTERNAL_SERVER_ERROR as string;

        let data: unknown = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const error = exceptionResponse as {
                    message?: string | string[];
                    error?: string;
                };

                if (Array.isArray(error.message)) {
                    message = 'Validation failed.';

                    data = {
                        errors: this.formatValidationErrors(error.message),
                    };
                } else {
                    message = error.message ?? error.error ?? message;
                }
            }
        } else if (exception instanceof Error) {
            if (isDevelopment) {
                data = {
                    exception: exception.name,
                    stack: exception.stack,
                };
            }
        }

        response.status(status).json({
            success: false,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    private formatValidationErrors(messages: string[]) {
        return messages.map((message) => ({
            field: this.extractField(message),
            message,
        }));
    }

    private extractField(message: string): string {
        return message.split(' ')[0];
    }
}
