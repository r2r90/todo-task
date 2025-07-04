import {ConflictException, Injectable} from '@nestjs/common';
import {PrismaService} from "@/prisma/prisma.service";
import {CreateTodoDto} from "@/todo/dto/create-todo.dto";
import {CreateTodoListDto} from "@/todo/dto/create-todo-list.dto";

@Injectable()
export class TodoService {
    constructor(private readonly prismaService: PrismaService) {
    }

    async getTodoList(userId: string) {
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
}
