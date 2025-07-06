import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength, MinLength} from "class-validator";

export class CreateTodoListDto {
    @ApiProperty({
        example: 'My Shopping List',
        minLength: 3,
        maxLength: 32
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(32)
    title: string;
}