import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { todoRoutes } from './todo.routes';

const routes = Router();

// Health check endpoint (ótimo para testar se a API tá no ar no deploy)
routes.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API Todo Backend funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
  });
});

routes.use('/auth', authRoutes);
routes.use('/todos', todoRoutes);

export { routes };
