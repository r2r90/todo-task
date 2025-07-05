import {IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength,} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class RegisterDto {
    @ApiProperty({
        example: 'John',
        description: 'First name of the user',
        minLength: 2,
        maxLength: 30,
    })
    @IsNotEmpty({message: 'First name cannot be empty.'})
    @IsString({message: 'First name must be a string.'})
    @Length(2, 30, {
        message: 'First name must be between 2 and 30 characters long.',
    })
    firstName: string

    @ApiProperty({
        example: 'Doe',
        description: 'Last name of the user',
        minLength: 2,
        maxLength: 30,
    })
    @IsNotEmpty({message: 'Last name cannot be empty.'})
    @IsString({message: 'Last name must be a string.'})
    @Length(2, 30, {
        message: 'Last name must be between 2 and 30 characters long.',
    })
    lastName: string

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Valid user email',
    })
    @IsNotEmpty({message: 'Email cannot be empty.'})
    @IsString({message: 'Email must be a string.'})
    @IsEmail({}, {message: 'Email must be a valid email address.'})
    email: string

    @ApiProperty({
        example: 'Password123!',
        description:
            'User password (8-20 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special)',
        minLength: 8,
        maxLength: 20,
    })
    @IsNotEmpty({message: 'Password cannot be empty.'})
    @IsString({message: 'Password must be a string.'})
    @MinLength(8, {message: 'Password must be at least 8 characters.'})
    @MaxLength(20, {message: 'Password must be at most 20 characters.'})
    @Matches(/(?=.*[A-Z])/, {
        message: 'Password must contain at least one uppercase letter.',
    })
    @Matches(/(?=.*[a-z])/, {
        message: 'Password must contain at least one lowercase letter.',
    })
    @Matches(/(?=.*\d)/, {
        message: 'Password must contain at least one digit.',
    })
    @Matches(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: 'Password must contain at least one special character.',
    })
    password: string
}