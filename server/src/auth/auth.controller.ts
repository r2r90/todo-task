import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoginDto } from '@/auth/dto/login.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}


	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto)
	}
}
