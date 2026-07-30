import { PrismaClient, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o Seed do Banco de Dados...');

  // Limpa dados existentes para garantir idempotência do seed
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('123456', 10);

  // Usuário 1: Professor
  const teacher = await prisma.user.create({
    data: {
      name: 'Professor Deploy',
      email: 'admin@todo.com',
      password: defaultPassword,
      todos: {
        create: [
          {
            title: 'Subir banco PostgreSQL na nuvem',
            description: 'Criar instância do PostgreSQL no Render/Railway para a aula.',
            priority: Priority.HIGH,
            completed: true,
          },
          {
            title: 'Configurar variáveis de ambiente (.env)',
            description: 'Definir DATABASE_URL, JWT_SECRET e CORS_ORIGIN no serviço de hospedagem.',
            priority: Priority.HIGH,
            completed: true,
          },
          {
            title: 'Executar migrations no banco de produção',
            description: 'Rodar npx prisma migrate deploy durante a etapa de build.',
            priority: Priority.HIGH,
            completed: false,
          },
          {
            title: 'Testar Swagger e endpoints com JWT',
            description: 'Validar registro, login e manipulação de tarefas via documentação.',
            priority: Priority.MEDIUM,
            completed: false,
          },
          {
            title: 'Conectar aplicação Frontend ao Backend',
            description: 'Configurar VITE_API_URL no frontend para apontar para a API deployada.',
            priority: Priority.MEDIUM,
            completed: false,
          },
          {
            title: 'Revisar dúvidas dos alunos sobre CORS',
            description: 'Explicar a importância da configuração de origens permitidas.',
            priority: Priority.LOW,
            completed: false,
          },
        ],
      },
    },
    include: {
      todos: true,
    },
  });

  // Usuário 2: Aluno
  const student = await prisma.user.create({
    data: {
      name: 'Aluno Estudioso',
      email: 'aluno@todo.com',
      password: defaultPassword,
      todos: {
        create: [
          {
            title: 'Assistir à aula prática de Deploy',
            description: 'Acompanhar a explicação do professor passo a passo.',
            priority: Priority.HIGH,
            completed: true,
          },
          {
            title: 'Clonar repositório e rodar o seed',
            description: 'Baixar o projeto e inicializar o banco localmente.',
            priority: Priority.HIGH,
            completed: true,
          },
          {
            title: 'Fazer deploy do meu próprio projeto Todo List',
            description: 'Publicar backend no Render e banco no Supabase/Neon.',
            priority: Priority.HIGH,
            completed: false,
          },
        ],
      },
    },
    include: {
      todos: true,
    },
  });

  console.log('✅ Seed executado com sucesso!');
  console.log('----------------------------------------------------');
  console.log('🔑 Credenciais geradas para testes:');
  console.log(` 1. Email: admin@todo.com  | Senha: 123456 (${teacher.todos.length} tarefas)`);
  console.log(` 2. Email: aluno@todo.com  | Senha: 123456 (${student.todos.length} tarefas)`);
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
