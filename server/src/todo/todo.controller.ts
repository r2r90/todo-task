import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
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
    async getAllLists(@Authorized('id') userId: string) {
        return this.todoService.getLists(userId)
    }

    @Authorization()
    @Post('list')
    async createList(
        @Authorized('id') userId: string,
        @Body() createTodoListDto: CreateTodoListDto,
    ) {
        return this.todoService.createTodoList(userId, createTodoListDto);
    }

    @Authorization()
    @Get('list/:id')
    async getList(@Param('id') listId: string,) {
        return this.todoService.getListById(listId);
    }

    @Authorization()
    @Delete('list/:id')
    async deleteTodoList(@Param('id') listId: string, @Authorized('id') userId: string) {
        return this.todoService.deleteTodoList(listId, userId);
    }


}
