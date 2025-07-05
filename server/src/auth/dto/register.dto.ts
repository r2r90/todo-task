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
    })
    @IsNotEmpty({ message: 'Password cannot be empty.' })
    @IsString({ message: 'Password must be a string.' })

    @Matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,20}$/,
        {
            message:
                'Password must be 8–20 chars, with at least one uppercase, one lowercase, one digit and one special character.',
        },
    )
    @MinLength(8, { message: 'Password must be at least 8 characters.' })
    @MaxLength(20, { message: 'Password must be at most 20 characters.' })
    password: string
}