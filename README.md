# 🎓 Projeto Exemplo: Deploy de Banco, Backend e Frontend

Este repositório contém a aplicação de demonstração fullstack pronta para a aula de deploy de Banco de Dados, API REST e Aplicação Web.

---

## 📂 Estrutura do Repositório

- **[`backend/`](./backend)**: API RESTful desenvolvida com Express, TypeScript, Prisma ORM (PostgreSQL), JWT, Zod, Swagger (`/docs`) e Dockerfile.
- **[`frontend/`](./frontend)**: Aplicação Web desenvolvida com Next.js 14 (App Router), TypeScript, Tailwind CSS (Glassmorphism Dark Theme) e Zod.

---

## 🚀 Como Executar o Projeto Completo

### 1. Iniciar o Backend & Banco de Dados

```bash
cd backend
docker-compose up -d
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```
> API backend em `http://localhost:3333` | Documentação em `http://localhost:3333/docs`

### 2. Iniciar o Frontend

Em outro terminal:
```bash
cd frontend
npm run dev
```
> Interface Web em `http://localhost:3000`

---

## 🔑 Credenciais de Teste (Seed)

- **Professor**: `admin@todo.com` | Senha: `123456`
- **Aluno**: `aluno@todo.com` | Senha: `123456`
