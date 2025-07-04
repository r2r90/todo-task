import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateTodoListDto {
    @ApiProperty({ example: 'My Shopping List' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;
}