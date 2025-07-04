import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { RegisterDto } from '@/auth/dto/register.dto'

@Injectable()
export class AuthService {
	constructor(private readonly prismaService: PrismaService) {
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
				firstName, lastName, email, password
			}
		})

		return user
	}
}
