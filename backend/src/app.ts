import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { routes } from './routes';
import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
}));

app.use(express.json());

// Rota de documentação Swagger interativa
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

// Custom error handling middleware
app.use(errorMiddleware);

export { app };
