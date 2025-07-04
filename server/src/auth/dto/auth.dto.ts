import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
	@ApiProperty({
		description: 'JWT Access token',
		example: '12345kqshdoqjhsqdhqjdhsqjd6'
	})
	accessToken: string
}