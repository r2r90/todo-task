import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { LoginDto } from '@/auth/dto/login.dto'
import type { Request, Response } from 'express'
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { AuthResponseDto } from '@/auth/dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}


	@Post('register')
	@ApiOperation({
		summary: 'Register a new user',
		description: 'Creates a new user account with first name, last name, email, and password.'
	})
	@ApiOkResponse({
		type: AuthResponseDto,
		description: 'User registered successfully'
	})
	@ApiConflictResponse({
		description: 'Invalid registration data'
	})
	@ApiBadRequestResponse({
		description: 'Invalid entry data'
	})
	@HttpCode(HttpStatus.CREATED)
	async register(@Res({ passthrough: true }) res: Response, @Body() dto: RegisterDto) {
		return await this.authService.register(res, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'User login',
		description: 'Authenticates a user using email and password, and sets the refresh token cookie.'
	})
	@ApiOkResponse({
		type: AuthResponseDto
	})
	@ApiBadRequestResponse({ description: 'Invalid login credentials' })
	@ApiNotFoundResponse({
		description: 'User not found'
	})
	async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
		return await this.authService.login(res, dto)
	}


	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Refresh access token',
		description: 'Generates a new access token using the refresh token cookie.'
	})
	@ApiOkResponse({
		type: AuthResponseDto,
		description: 'Generates a new access token using the refresh token cookie.'
	})
	@ApiUnauthorizedResponse({
		description: 'Invalid or expired refresh token'
	})
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return await this.authService.refresh(req, res)
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: 'Logout user',
		description: 'Clears the refresh token cookie and invalidates the session.'
	})
	@ApiResponse({
		status: 200,
		description: 'User logged out successfully'
	})
	async logout(@Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(res)
	}
}
