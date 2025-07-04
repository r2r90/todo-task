import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RegisterDto } from '@/auth/dto/register.dto'
import { hash, verify } from 'argon2'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from '@/auth/interfaces/jwt.interface'
import { LoginDto } from '@/auth/dto/login.dto'

@Injectable()
export class AuthService {

	private readonly JWT_SECRET: string
	private readonly JWT_ACCESS_TOKEN_TTL: string
	private readonly JWT_REFRESH_TOKEN_TTL: string

	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_SECRET = configService.getOrThrow<string>('JWT_SECRET')
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL')
		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL')
	}

	async register(dto: RegisterDto) {
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

		return this.generateTokens(user.id)
	}

	async login(dto: LoginDto) {
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

		return this.generateTokens(user.id)


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


}
