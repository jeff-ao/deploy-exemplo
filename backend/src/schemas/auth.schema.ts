import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Nome é obrigatório' })
      .min(2, 'O nome deve ter pelo menos 2 caracteres'),
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .email('Formato de e-mail inválido'),
    password: z
      .string({ required_error: 'Senha é obrigatória' })
      .min(6, 'A senha deve ter pelo menos 6 caracteres'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'E-mail é obrigatório' })
      .email('Formato de e-mail inválido'),
    password: z
      .string({ required_error: 'Senha é obrigatória' }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
