import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {TodoService} from './todo.service';
import {Authorization} from "@/auth/decorators/authorization.decorator";
import {Authorized} from "@/auth/decorators/authorized.decorator";
import {CreateTodoListDto} from "@/todo/dto/create-todo-list.dto";
import {CreateTodoDto} from "@/todo/dto/create-todo.dto";
import {ApiOperation} from "@nestjs/swagger";

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Authorization()
    @Post()
    @ApiOperation({ summary: 'Create a todo task' })
    async createTodo(
        @Authorized('id') userId: string,
        @Body() dto: CreateTodoDto)
    {
        return this.todoService.createTodo(userId, dto);
    }

    @Authorization()
    @Get('list/:listId/todos')
    async getTodosInList(
        @Authorized('id') userId: string,
        @Param('listId') listId: string,
    ) {
        return this.todoService.getTodosInList(userId, listId);
    }


    @Authorization()
    @Patch(':id')
    async markCompleted(@Authorized('id') userId: string, @Param('id') todoId: string) {
        return this.todoService.markTodoCompleted(userId, todoId);
    }

    @Authorization()
    @Delete(':id')
    async deleteTodo(@Authorized('id') userId: string, @Param('id') todoId: string) {
        return this.todoService.deleteTodo(userId, todoId);
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
    async deleteList(@Param('id') listId: string, @Authorized('id') userId: string) {
        return this.todoService.deleteTodoList(listId, userId);
    }
}
