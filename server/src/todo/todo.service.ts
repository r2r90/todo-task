import {ConflictException, ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "@/prisma/prisma.service";
import {CreateTodoDto} from "@/todo/dto/create-todo.dto";
import {CreateTodoListDto} from "@/todo/dto/create-todo-list.dto";

@Injectable()
export class TodoService {
    constructor(private readonly prismaService: PrismaService) {
    }


    async createTodo(userId: string, listId: string, dto: CreateTodoDto) {
        const {longDescription, dueDate, shortDescription} = dto;
        const list = await this.getListById(listId);

        if (list.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to add tasks to this list.');
        }

        return this.prismaService.todo.create({
            data: {
                shortDescription,
                dueDate,
                longDescription,
                todoListId: listId,
            }
        })
    }

    async getTodoById(todoId: string) {
        const todo = await this.prismaService.todo.findUnique({
            where: {id: todoId},
            include: {todoList: true},
        });

        if (!todo) {
            throw new NotFoundException('Todo not found');
        }

        if (!todo.todoList) {
            throw new NotFoundException('Todo list not found for this task');
        }

        return todo
    }


    async updateTask(userId: string, todoId: string) {
        const todo = await this.getTodoById(todoId);

        if (todo.todoList!.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to modify this todo.');
        }

        return this.prismaService.todo.update({
            where: {id: todoId},
            data: {
                completed: !todo.completed,
            },
        });
    }

    async deleteTodo(userId, todoId) {
        const todo = await this.getTodoById(todoId);
        if (todo.todoList!.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to modify this todo.');
        }

        await this.prismaService.todo.delete({
            where: {id: todoId},
        })

        return {message: 'Task deleted successfully.'};

    }

    async getTodosInList(userId: string, listId: string) {
        const list = await this.getListById(listId);

        if (list.ownerId !== userId) {
            throw new ForbiddenException('You do not have permission to view this list.');
        }

        return this.prismaService.todo.findMany({
            where: {
                todoListId: listId,
            },
            orderBy: {dueDate: 'asc'}
        })


    }

    async getLists(userId: string) {
        return this.prismaService.todoList.findMany({
            where: {ownerId: userId},
            include: {todos: true}
        })
    }

    async createTodoList(userId: string, dto: CreateTodoListDto) {
        const isTitleExist = await this.prismaService.todoList.findUnique({
            where: {
                ownerId_title: {
                    ownerId: userId,
                    title: dto.title
                }

            }
        })

        if (isTitleExist) {
            throw new ConflictException('A todo list with this title already exists.');
        }


        return this.prismaService.todoList.create({
            data: {
                title: dto.title,
                ownerId: userId,
            },
        });
    }

    async getListById(listId: string) {
        const list = await this.prismaService.todoList.findUnique({
            where: {
                id: listId,
            }
        })

        if (!list) {
            throw new NotFoundException('Todo list not found')
        }

        return list;

    }

    async deleteTodoList(listId: string, userId: string) {

        const list = await this.getListById(listId);

        if (list.ownerId !== userId) {
            throw new ForbiddenException('You do not have access to this list');
        }

        await this.prismaService.todoList.delete({
            where: {id: listId},
        })

        return {message: 'Todo List deleted successfully.'};
    }
}
