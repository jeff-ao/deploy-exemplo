import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';

interface TokenPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token não informado.', 401);
  }

  const [, token] = authHeader.split(' ');

  if (!token) {
    throw new AppError('Formato de token inválido.', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    req.user = {
      id: decoded.sub,
      email: decoded.email,
    };

    return next();
  } catch (error) {
    throw new AppError('Token JWT inválido ou expirado.', 401);
  }
}
