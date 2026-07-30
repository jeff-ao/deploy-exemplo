# 🚀 Todo List API - Backend para Aula de Deploy

Este projeto é um backend de demonstração bem estruturado para uma aplicação **Todo List**, ideal para aulas e tutoriais de **deploy de banco de dados, backend e frontend**.

## 🛠️ Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Express**: Framework web flexível e rápido
- **Prisma ORM**: Modelagem e manipulação de banco de dados
- **PostgreSQL**: Banco de dados relacional
- **Zod**: Validação estrita de esquemas e dados de entrada
- **JWT (jsonwebtoken)**: Autenticação via token no padrão Bearer
- **Bcryptjs**: Criptografia de senhas
- **Docker / Docker Compose**: Para containerização e execução rápida do banco local

---

## 🏗️ Arquitetura do Projeto

O projeto adota uma arquitetura em camadas clara e desacoplada:

```text
src/
├── config/         # Configurações de ambiente (.env) e instância do Prisma
├── errors/         # Classe de erros customizados (AppError)
├── middlewares/    # Autenticação JWT, Validação Zod e Tratamento Global de Erros
├── schemas/        # Schemas de validação Zod (Auth e Todos)
├── services/       # Regra de negócio da aplicação (AuthService, TodoService)
├── controllers/    # Camada HTTP que recebe requests e envia respostas (AuthController, TodoController)
├── routes/         # Definição das rotas da API (auth.routes.ts, todo.routes.ts)
├── types/          # Definição de tipos customizados (Ex: req.user no Express)
├── app.ts          # Configuração dos middlewares globais e rotas Express
└── server.ts       # Ponto de entrada da aplicação
```

---

## ⚙️ Como Executar Localmente

### 1. Clonar e Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

O projeto já possui um arquivo `.env` pré-configurado. Se desejar, copie de `.env.example`:

```env
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tododb?schema=public"
JWT_SECRET="sua_chave_secreta_super_segura_para_aula_de_deploy_123!"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="*"
```

### 3. Subir o Banco de Dados com Docker (Opcional se já tiver PostgreSQL)

```bash
docker-compose up -d
```

### 4. Rodar as Migrações do Prisma

```bash
npx prisma migrate dev --name init
```

### 5. Popular o Banco de Dados com Dados de Teste (Seed)

```bash
npx prisma db seed
```

> **Credenciais de teste geradas:**
> - **Professor**: `admin@todo.com` | Senha: `123456`
> - **Aluno**: `aluno@todo.com` | Senha: `123456`

### 6. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

A API estará rodando em `http://localhost:3333`.

---

## 📚 Documentação Swagger Interativa

Acesse no navegador:
👉 **[http://localhost:3333/docs](http://localhost:3333/docs)**

A documentação interativa permite testar todos os endpoints (Registro, Login, CRUD de Todos) diretamente na página web, com autenticação Bearer JWT integrada.

---

## 📌 Rotas da API

### 🏥 Healthcheck
- `GET /api/health` -> Verifica se a API está online.

### 🔐 Autenticação (`/api/auth`)
- `POST /api/auth/register` -> Cadastra um novo usuário.
  ```json
  {
    "name": "Maria Silva",
    "email": "maria@email.com",
    "password": "senhaSegura123"
  }
  ```
- `POST /api/auth/login` -> Autentica o usuário e retorna o token JWT.
  ```json
  {
    "email": "maria@email.com",
    "password": "senhaSegura123"
  }
  ```
- `GET /api/auth/profile` -> Retorna dados do usuário logado (Requer header `Authorization: Bearer <TOKEN>`).

---

### 📝 Tarefas (`/api/todos`) - *Todas Requerem JWT*

Header necessário: `Authorization: Bearer <TOKEN>`

- `GET /api/todos` -> Lista as tarefas do usuário autenticado.
  - Query params opcionais: `completed=true|false`, `priority=LOW|MEDIUM|HIGH`, `search=texto`
- `POST /api/todos` -> Cria uma nova tarefa.
  ```json
  {
    "title": "Estudar Deploy de Banco de Dados",
    "description": "Configurar container PostgreSQL no servidor",
    "priority": "HIGH"
  }
  ```
- `GET /api/todos/:id` -> Obtém detalhes de uma tarefa específica.
- `PUT /api/todos/:id` -> Atualiza os dados de uma tarefa.
- `PATCH /api/todos/:id/toggle` -> Alterna o status `completed` de uma tarefa.
- `DELETE /api/todos/:id` -> Deleta uma tarefa.

---

## 🐳 Deploy para Produção

Este repositório inclui um **`Dockerfile`** pronto e otimizado para ser utilizado em plataformas de deploy como:
- Render
- Railway
- Fly.io
- AWS / DigitalOcean (via Docker / CapRover / Coolify)

### Comandos de Build de Produção
```bash
npm run build
npm start
```
