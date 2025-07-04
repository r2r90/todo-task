import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
	@ApiProperty({
		example: 'John',
		description: 'First name of the user',
		minLength: 2,
		maxLength: 20,
	})
	@IsNotEmpty({ message: 'First name cannot be empty' })
	@IsString({ message: 'First name must be a string' })
	@Length(2, 20, { message: 'First name must be between 2 and 20 characters' })
	firstName: string

	@ApiProperty({
		example: 'Doe',
		description: 'Last name of the user',
		minLength: 2,
		maxLength: 50,
	})
	@IsNotEmpty({ message: 'Last name cannot be empty' })
	@IsString({ message: 'Last name must be a string' })
	@Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
	lastName: string


	@ApiProperty({
		example: 'john.doe@example.com',
		description: 'Valid user email',
	})
	@IsNotEmpty({ message: 'Email cannot be empty' })
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string


	@ApiProperty({
		example: 'password123',
		description: 'User password (6-128 chars)',
		minLength: 6,
		maxLength: 128,
	})
	@IsNotEmpty({ message: 'Password cannot be empty' })
	@IsString({ message: 'Password must be a string' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	@MaxLength(128, { message: 'Password must be at most 128 characters long' })
	password: string
}
