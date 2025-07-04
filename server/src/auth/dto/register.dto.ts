import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
	@IsNotEmpty({ message: 'First name cannot be empty' })
	@IsString({ message: 'First name must be a string' })
	@Length(2, 20, { message: 'First name must be between 2 and 20 characters' })
	firstName: string

	@IsNotEmpty({ message: 'Last name cannot be empty' })
	@IsString({ message: 'Last name must be a string' })
	@Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
	lastName: string

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
