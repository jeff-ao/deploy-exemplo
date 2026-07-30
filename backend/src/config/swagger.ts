import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📋 Todo List API - Aula de Deploy',
      version: '1.0.0',
      description: `
API RESTful completa desenvolvida com **Express**, **Prisma**, **TypeScript**, **JWT** e **Zod**.
Projetada para ser utilizada como aplicação de suporte em aulas de deploy fullstack.

### 🔑 Como se autenticar no Swagger:
1. Cadastre-se ou faça login em \`/api/auth/login\` com a conta de teste (\`admin@todo.com\` / \`123456\`).
2. Copie o token retornado na resposta.
3. Clique no botão **Authorize** (ou no ícone do cadeado) acima/ao lado e cole o token no formato: \`Bearer SEU_TOKEN_AQUI\`.
      `,
      contact: {
        name: 'Suporte à Aula de Deploy',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor Local de Desenvolvimento',
      },
      {
        url: '/api',
        description: 'Servidor de Produção (Caminho Relativo)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira seu token JWT no formato: Bearer <token>',
        },
      },
      schemas: {
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Professor Deploy' },
            email: { type: 'string', format: 'email', example: 'admin@todo.com' },
            password: { type: 'string', minLength: 6, example: '123456' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@todo.com' },
            password: { type: 'string', example: '123456' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                  },
                },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...' },
              },
            },
          },
        },
        CreateTodoInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title: { type: 'string', example: 'Configurar banco PostgreSQL no Render' },
            description: { type: 'string', example: 'Criar instância no banco de produção para a aula.' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
          },
        },
        UpdateTodoInput: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Título Atualizado' },
            description: { type: 'string', example: 'Nova descrição da tarefa' },
            completed: { type: 'boolean', example: true },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          },
        },
        TodoItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            completed: { type: 'boolean' },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            userId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Mensagem explicativa do erro' },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['🏥 Healthcheck'],
          summary: 'Verifica se a API está online',
          responses: {
            200: {
              description: 'API operando normalmente',
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['🔐 Autenticação'],
          summary: 'Cadastrar um novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RegisterInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuário cadastrado com sucesso',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            400: { description: 'Erro de validação nos dados enviados' },
            409: { description: 'E-mail já está em uso' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['🔐 Autenticação'],
          summary: 'Autenticar usuário e obter Token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginInput' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login efetuado com sucesso',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } },
              },
            },
            401: { description: 'Credenciais inválidas' },
          },
        },
      },
      '/api/auth/profile': {
        get: {
          tags: ['🔐 Autenticação'],
          summary: 'Obter dados do perfil do usuário autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Perfil retornado com sucesso' },
            401: { description: 'Token JWT ausente ou inválido' },
          },
        },
      },
      '/api/todos': {
        get: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Listar todas as tarefas do usuário autenticado',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'completed',
              in: 'query',
              required: false,
              schema: { type: 'boolean' },
              description: 'Filtrar por tarefas concluídas (true) ou pendentes (false)',
            },
            {
              name: 'priority',
              in: 'query',
              required: false,
              schema: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
              description: 'Filtrar por prioridade',
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Buscar por termo no título ou descrição',
            },
          ],
          responses: {
            200: { description: 'Lista de tarefas retornada com sucesso' },
            401: { description: 'Não autorizado' },
          },
        },
        post: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Criar uma nova tarefa',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateTodoInput' },
              },
            },
          },
          responses: {
            201: { description: 'Tarefa criada com sucesso' },
            400: { description: 'Erro de validação dos dados' },
            401: { description: 'Não autorizado' },
          },
        },
      },
      '/api/todos/{id}': {
        get: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Obter detalhes de uma tarefa por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Tarefa encontrada' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
        put: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Atualizar dados de uma tarefa existente',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdateTodoInput' },
              },
            },
          },
          responses: {
            200: { description: 'Tarefa atualizada com sucesso' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
        delete: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Deletar uma tarefa por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Tarefa deletada com sucesso' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
      },
      '/api/todos/{id}/toggle': {
        patch: {
          tags: ['📝 Tarefas (Todos)'],
          summary: 'Alternar status da tarefa entre concluída e pendente',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
          ],
          responses: {
            200: { description: 'Status da tarefa alterado com sucesso' },
            404: { description: 'Tarefa não encontrada' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
