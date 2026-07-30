import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeployTasks - Todo List Fullstack para Aula de Deploy',
  description: 'Aplicação demonstrativa de gerenciamento de tarefas com Express, Prisma, JWT, Zod e Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-brand-500/30 selection:text-brand-400">
        {children}
      </body>
    </html>
  );
}
