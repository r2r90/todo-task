import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { hash, verify } from 'argon2'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import type { JwtPayload } from '@/auth/interfaces/jwt.interface'
import { LoginDto } from '@/auth/dto/login.dto'
import type { Request, Response } from 'express'
import { isDev } from '@/lib/utils/is-dev.util'

@Injectable()
export class AuthService {

	private readonly JWT_ACCESS_TOKEN_TTL: string
	private readonly JWT_REFRESH_TOKEN_TTL: string
	private readonly COOKIE_DOMAIN: string

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL')
		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL')
		this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN')
	}

	async register(res: Response, dto: RegisterDto) {
		const { firstName, lastName, email, password } = dto

		const existUser = await this.prismaService.user.findUnique({
			where: { email }
		})

		if (existUser) {
			throw new ConflictException('User already exists')
		}

		const user = await this.prismaService.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: await hash(password)
			}
		})

		return this.auth(res, user.id)
	}

	async login(res: Response, dto: LoginDto) {
		const { email, password } = dto

		const user = await this.prismaService.user.findUnique({
			where: { email },
			select: {
				id: true,
				password: true
			}
		})

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new NotFoundException('User not found')
		}

		return this.auth(res, user.id)

	}

	async refresh(req: Request, res: Response) {
		const refreshToken = req.cookies['refreshToken']
		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token not found')
		}

		const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken)

		if (payload) {
			const user = await this.prismaService.user.findUnique({
				where: {
					id: payload.id
				},
				select: {
					id: true
				}
			})


			if (!user) {
				throw new UnauthorizedException('User not found')
			}

			return this.auth(res, user.id)
		}

		return false
	}

	async logout(res: Response) {
		this.setCookie(res, 'refreshToken', new Date(0))
		return true
	}

	private auth(res: Response, id: string) {
		const { accessToken, refreshToken } = this.generateTokens(id)

		this.setCookie(res, refreshToken, new Date(Date.now() + 60 * 60 * 24 * 7))

		return { accessToken }
	}

	private generateTokens(id: string) {
		const payload: JwtPayload = { id }

		const accessToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		})

		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		})

		return { accessToken, refreshToken }
	}


	private setCookie(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIE_DOMAIN,
			expires,
			secure: !isDev(this.configService),
			sameSite: isDev(this.configService) ? 'none' : 'lax'

		})
	}

}
