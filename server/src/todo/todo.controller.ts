import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {TodoService} from './todo.service';
import {Authorization} from "@/auth/decorators/authorization.decorator";
import {Authorized} from "@/auth/decorators/authorized.decorator";
import {CreateTodoListDto} from "@/todo/dto/create-todo-list.dto";
import {CreateTodoDto} from "@/todo/dto/create-todo.dto";
import {
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation
} from "@nestjs/swagger";

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Authorization()
    @Post()
    @ApiOperation({ summary: 'Create a todo task' })
    @ApiCreatedResponse({ description: 'Todo task created successfully.' })
    @ApiForbiddenResponse({ description: 'No permission to add tasks to this list.' })
    async createTodo(
        @Authorized('id') userId: string,
        @Body() dto: CreateTodoDto)
    {
        return this.todoService.createTodo(userId, dto);
    }

    @Authorization()
    @Get('list/:listId/todos')
    @ApiOperation({ summary: 'Get tasks in a list' })
    @ApiOkResponse({ description: 'List of tasks retrieved successfully.' })
    @ApiForbiddenResponse({ description: 'No permission to view this list.' })
    @ApiNotFoundResponse({ description: 'Todo list not found.' })
    async getTodosInList(
        @Authorized('id') userId: string,
        @Param('listId') listId: string,
    ) {
        return this.todoService.getTodosInList(userId, listId);
    }


    @Authorization()
    @ApiOperation({ summary: 'Mark a task as completed' })
    @ApiOkResponse({ description: 'Task marked as completed.' })
    @ApiForbiddenResponse({ description: 'No permission to modify this task.' })
    @ApiNotFoundResponse({ description: 'Todo task not found.' })
    @Patch(':id')
    async markCompleted(@Authorized('id') userId: string, @Param('id') todoId: string) {
        return this.todoService.markTodoCompleted(userId, todoId);
    }

    @Authorization()
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a todo task' })
    @ApiOkResponse({ description: 'Task deleted successfully.' })
    @ApiForbiddenResponse({ description: 'No permission to delete this task.' })
    @ApiNotFoundResponse({ description: 'Todo task not found.' })
    async deleteTodo(@Authorized('id') userId: string, @Param('id') todoId: string) {
        return this.todoService.deleteTodo(userId, todoId);
    }

    @Authorization()
    @Get('list')
    @ApiOperation({ summary: 'Get all todo lists' })
    @ApiOkResponse({ description: 'List of todo lists retrieved successfully.' })
    async getAllLists(@Authorized('id') userId: string) {
        return this.todoService.getLists(userId)
    }

    @Authorization()
    @Post('list')
    @ApiOperation({ summary: 'Create a new todo list' })
    @ApiCreatedResponse({ description: 'Todo list created successfully.' })
    @ApiConflictResponse({ description: 'A list with the same title already exists.' })
    async createList(
        @Authorized('id') userId: string,
        @Body() createTodoListDto: CreateTodoListDto,
    ) {
        return this.todoService.createTodoList(userId, createTodoListDto);
    }

    @Authorization()
    @Get('list/:id')
    @ApiOperation({ summary: 'Get a todo list by id' })
    @ApiOkResponse({ description: 'Todo list retrieved successfully.' })
    @ApiNotFoundResponse({ description: 'Todo list not found.' })
    async getList(@Param('id') listId: string,) {
        return this.todoService.getListById(listId);
    }

    @Authorization()
    @Delete('list/:id')
    @ApiOperation({ summary: 'Delete a todo list' })
    @ApiOkResponse({ description: 'Todo list deleted successfully.' })
    @ApiForbiddenResponse({ description: 'No permission to delete this list.' })
    @ApiNotFoundResponse({ description: 'Todo list not found.' })
    async deleteList(@Param('id') listId: string, @Authorized('id') userId: string) {
        return this.todoService.deleteTodoList(listId, userId);
    }
}
