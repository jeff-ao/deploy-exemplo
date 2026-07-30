# 🎨 Todo List Frontend - App Next.js para Aula de Deploy

Interface moderna, extremamente elegante e responsiva para a aplicação de gerenciamento de tarefas (Todo List), desenvolvida em **Next.js (App Router)** com **TypeScript**, **Zod** e **Tailwind CSS**.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**: Estilização moderna com Glassmorphism, gradientes e tema Dark.
- **Zod**: Validação de dados de formulário no cliente.
- **React Hook Form**: Manipulação de formulários com integração nativa ao `@hookform/resolvers/zod`.
- **Axios**: Requisições HTTP com interceptors para injeção de Token JWT.
- **Lucide React**: Biblioteca de ícones modernos.

---

## 🚀 Funcionalidades

1. **🔐 Autenticação (Login & Cadastro)**
   - Validação em tempo real dos campos de entrada com Zod.
   - Botões de **preenchimento automático rápido** para os usuários de teste (Professor e Aluno).
   - Armazenamento seguro de Token JWT e dados no `localStorage`.
   - Proteção de rotas (Auth Guard) com redirecionamento em caso de token expirado.

2. **📝 Gerenciamento de Tarefas (Dashboard)**
   - Visualização com **Métricas em Tempo Real** (Total, Concluídas, Pendentes e Urgentes).
   - Filtros dinâmicos por status (Todas, Pendentes, Concluídas), prioridade (`LOW`, `MEDIUM`, `HIGH`) e busca por texto no título ou descrição.
   - Alternância rápida de concluída/pendente com animações.
   - Modal de criação e edição com validação de esquema Zod.
   - Remoção com confirmação visual.

---

## ⚙️ Como Executar Localmente

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie ou verifique o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O frontend estará disponível em: **[http://localhost:3000](http://localhost:3000)**.

---

## 🌐 Deploy para Produção

Compatível com plataformas como **Vercel**, **Netlify**, **Cloudflare Pages** ou via **Docker**:

```bash
npm run build
npm start
```
