import { app } from './app';
import { env } from './config/env';

app.listen(env.PORT, () => {
  console.log(`🚀 Servidor rodando com sucesso na porta ${env.PORT}`);
  console.log(`📡 Healthcheck disponível em http://localhost:${env.PORT}/api/health`);
  console.log(`📚 Documentação Swagger interativa: http://localhost:${env.PORT}/docs`);
});
