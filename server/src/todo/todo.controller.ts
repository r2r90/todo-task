import {Body, Controller, Get, Post} from '@nestjs/common';
import {TodoService} from './todo.service';
import {Authorization} from "@/auth/decorators/authorization.decorator";
import {Authorized} from "@/auth/decorators/authorized.decorator";
import {CreateTodoListDto} from "@/todo/dto/create-todo-list.dto";

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Authorization()
    @Get('list')
    async getTodoList(@Authorized('id') userId: string) {
        return this.todoService.getTodoList(userId)
    }

    @Authorization()
    @Post('list')
    async createList(
        @Authorized('id') userId: string,
        @Body() createTodoListDto: CreateTodoListDto,
    ) {
        return this.todoService.createTodoList(userId, createTodoListDto);
    }
}
