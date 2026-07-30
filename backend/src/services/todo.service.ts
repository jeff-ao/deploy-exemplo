import { prisma } from '../config/prisma';
import { AppError } from '../errors/AppError';
import { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema';
import { Priority } from '@prisma/client';

export interface GetTodosFilters {
  completed?: boolean;
  priority?: Priority;
  search?: string;
}

export class TodoService {
  async getTodos(userId: string, filters: GetTodosFilters) {
    const where: any = { userId };

    if (filters.completed !== undefined) {
      where.completed = filters.completed;
    }

    if (filters.priority) {
      where.priority = filters.priority;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return todos;
  }

  async getTodoById(userId: string, todoId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
    });

    if (!todo) {
      throw new AppError('Tarefa não encontrada.', 404);
    }

    return todo;
  }

  async createTodo(userId: string, data: CreateTodoInput) {
    const todo = await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority as Priority,
        userId,
      },
    });

    return todo;
  }

  async updateTodo(userId: string, todoId: string, data: UpdateTodoInput) {
    await this.getTodoById(userId, todoId); // Verify ownership

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.priority !== undefined && { priority: data.priority as Priority }),
      },
    });

    return updatedTodo;
  }

  async toggleTodoStatus(userId: string, todoId: string) {
    const todo = await this.getTodoById(userId, todoId);

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        completed: !todo.completed,
      },
    });

    return updatedTodo;
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.getTodoById(userId, todoId); // Verify ownership

    await prisma.todo.delete({
      where: { id: todoId },
    });

    return { message: 'Tarefa deletada com sucesso.' };
  }
}
