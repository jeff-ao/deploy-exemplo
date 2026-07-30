import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller';
import { ensureAuthenticated } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdParamSchema,
  queryTodoSchema,
} from '../schemas/todo.schema';

const todoRoutes = Router();
const todoController = new TodoController();

// Todos os endpoints de tarefas requerem autenticação JWT
todoRoutes.use(ensureAuthenticated);

todoRoutes.get('/', validate(queryTodoSchema), todoController.getTodos);
todoRoutes.post('/', validate(createTodoSchema), todoController.createTodo);
todoRoutes.get('/:id', validate(todoIdParamSchema), todoController.getTodoById);
todoRoutes.put('/:id', validate(updateTodoSchema), todoController.updateTodo);
todoRoutes.patch('/:id/toggle', validate(todoIdParamSchema), todoController.toggleTodoStatus);
todoRoutes.delete('/:id', validate(todoIdParamSchema), todoController.deleteTodo);

export { todoRoutes };
