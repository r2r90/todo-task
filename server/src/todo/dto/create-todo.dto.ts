import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateTodoDto {
    @ApiProperty({ example: 'Buy milk' })
    @IsString()
    @IsNotEmpty()
    shortDescription: string;

    @ApiProperty({ example: 'Buy 2 liters of milk in the store', required: false })
    @IsString()
    @IsOptional()
    longDescription?: string;

    @ApiProperty({ example: '2025-08-15T23:59:00.000Z' })
    @IsDateString()
    dueDate: string;

    @ApiProperty({ example: 'uuid-of-list' })
    @IsUUID()
    todoListId: string;
}