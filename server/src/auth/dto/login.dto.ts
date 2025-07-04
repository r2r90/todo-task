import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
	@IsNotEmpty({ message: 'Email cannot be empty' })
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string

	@IsNotEmpty({ message: 'Password cannot be empty' })
	@IsString({ message: 'Password must be a string' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@MaxLength(128, { message: 'Password must be at most 128 characters long' })
	password: string
}