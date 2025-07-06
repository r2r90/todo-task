import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty({
        example: 'Buy milk',
        minLength: 3,
        maxLength: 16
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(16)
    shortDescription: string;

    @ApiProperty({
        example: 'Buy 2 liters of milk in the store',
        required: false,
        maxLength: 64
    })
    @IsString()
    @IsOptional()
    @MaxLength(64)
    longDescription?: string;

    @ApiProperty({
        example: '2025-08-15T23:59:00.000Z'
    })
    @IsDateString()
    dueDate: string;
}
