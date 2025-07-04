import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import type { Response } from 'express'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}


	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Res({passthrough:true}) res: Response, @Body() dto: RegisterDto) {
		return await this.authService.register(res, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Res({passthrough:true}) res: Response, @Body() dto: LoginDto) {
		return await this.authService.login(res, dto)
	}
}
