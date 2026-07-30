import { z } from 'zod';

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Título é obrigatório' })
      .min(1, 'O título não pode estar vazio')
      .max(100, 'O título não pode exceder 100 caracteres'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID do Todo deve ser um UUID válido'),
  }),
  body: z.object({
    title: z.string().min(1, 'O título não pode estar vazio').max(100).optional(),
    description: z.string().nullable().optional(),
    completed: z.boolean().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  }),
});

export const todoIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID do Todo deve ser um UUID válido'),
  }),
});

export const queryTodoSchema = z.object({
  query: z.object({
    completed: z.string().optional().transform((val) => {
      if (val === 'true') return true;
      if (val === 'false') return false;
      return undefined;
    }),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    search: z.string().optional(),
  }),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>['body'];
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>['body'];
