import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}


	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto)
	}
}
