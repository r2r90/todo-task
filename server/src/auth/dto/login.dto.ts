import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({ example: 'user@example.com', description: 'User email address' })
	@IsNotEmpty({ message: 'Email cannot be empty' })
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string;

	@ApiProperty({ example: 'StrongPassword123', description: 'User password' })
	@IsNotEmpty({ message: 'Password cannot be empty' })
	password: string;
}