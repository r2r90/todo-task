import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class CreateTodoListDto {
    @ApiProperty({
        example: 'My Shopping List',
        minLength: 3,
        maxLength: 32
    })
    @IsString({message: 'Title must be a string'})
    @IsNotEmpty({message: 'Title is required'})
    @MinLength(3,  {message: 'Title length must be at most 3 characters'})
    @MaxLength(32, {message: 'Max length must be at least 32 characters'})
    title: string;
}