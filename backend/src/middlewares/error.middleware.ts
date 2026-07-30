import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Falha de validação',
      errors: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[])?.join(', ') || 'Campo';
      res.status(409).json({
        status: 'error',
        message: `Já existe um registro com este valor (${target}).`,
      });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({
        status: 'error',
        message: 'Registro não encontrado no banco de dados.',
      });
      return;
    }
  }

  console.error('[Internal Error]:', error);

  res.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor.',
  });
}
