import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import { Priority } from '@prisma/client';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { completed, priority, search } = req.query;

      const filters = {
        completed: completed === 'true' ? true : completed === 'false' ? false : undefined,
        priority: priority as Priority | undefined,
        search: search as string | undefined,
      };

      const todos = await this.todoService.getTodos(userId, filters);
      res.status(200).json({
        status: 'success',
        results: todos.length,
        data: todos,
      });
    } catch (error) {
      next(error);
    }
  };

  getTodoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const todo = await this.todoService.getTodoById(userId, id);
      res.status(200).json({
        status: 'success',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const todo = await this.todoService.createTodo(userId, req.body);
      res.status(201).json({
        status: 'success',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const todo = await this.todoService.updateTodo(userId, id, req.body);
      res.status(200).json({
        status: 'success',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleTodoStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const todo = await this.todoService.toggleTodoStatus(userId, id);
      res.status(200).json({
        status: 'success',
        data: todo,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await this.todoService.deleteTodo(userId, id);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };
}
