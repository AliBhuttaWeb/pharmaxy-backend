import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    async login(@Body() credentials: { email: string; password: string }) {
        const user = await this.authService.validateUser(credentials.email, credentials.password);

        if (!user) {
            return { message: 'Invalid credentials' };
        }

        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: { email: string; password: string }) {
        return this.authService.register(body.email, body.password);
    }
}
