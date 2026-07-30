'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { StatsHeader } from '@/components/StatsHeader';
import { TodoCard } from '@/components/TodoCard';
import { TodoModal } from '@/components/TodoModal';
import { Todo, User, Priority } from '@/lib/types';
import { TodoFormData } from '@/lib/schemas';
import { api } from '@/lib/api';
import { Plus, Search, Filter, CheckCircle2, ListTodo, RefreshCw, Layers } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'ALL' | Priority>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Load user & check auth
  useEffect(() => {
    const token = localStorage.getItem('@todoapp:token');
    const storedUser = localStorage.getItem('@todoapp:user');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      router.push('/login');
    }
  }, [router]);

  // Fetch todos from backend
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {};

      if (filterStatus === 'completed') params.completed = 'true';
      if (filterStatus === 'pending') params.completed = 'false';
      if (filterPriority !== 'ALL') params.priority = filterPriority;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const response = await api.get('/todos', { params });
      setTodos(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  // Create or Update Todo
  const handleSaveTodo = async (data: TodoFormData) => {
    if (editingTodo) {
      const response = await api.put(`/todos/${editingTodo.id}`, data);
      setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? response.data.data : t)));
    } else {
      const response = await api.post('/todos', data);
      setTodos((prev) => [response.data.data, ...prev]);
    }
  };

  // Toggle Todo completion status
  const handleToggleTodo = async (id: string) => {
    try {
      const response = await api.patch(`/todos/${id}/toggle`);
      setTodos((prev) => prev.map((t) => (t.id === id ? response.data.data : t)));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-black pb-20">
      
      {/* Navbar */}
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Title + Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Suas <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-accent-cyan">Tarefas</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Gerencie suas pendências em tempo real com validação e persistence via Prisma
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-2xl shadow-glow transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Nova Tarefa</span>
          </button>
        </div>

        {/* Stats Metrics */}
        <StatsHeader todos={todos} />

        {/* Filters Bar */}
        <div className="glass-card rounded-2xl p-4 mb-8 border border-gray-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar tarefa por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white placeholder-gray-500 glass-input"
            />
          </div>

          {/* Tab Status Filters */}
          <div className="flex items-center gap-1 bg-dark-900/80 p-1 rounded-xl border border-gray-800/80 self-start md:self-auto">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'pending', label: 'Pendentes' },
              { id: 'completed', label: 'Concluídas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === tab.id
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="bg-dark-900/80 border border-gray-800 text-gray-300 text-xs font-semibold rounded-xl px-3 py-2.5 focus:border-brand-500 outline-none"
            >
              <option value="ALL">Todas as Prioridades</option>
              <option value="HIGH">Alta Prioridade</option>
              <option value="MEDIUM">Média Prioridade</option>
              <option value="LOW">Baixa Prioridade</option>
            </select>
          </div>

        </div>

        {/* Todo List Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card h-28 rounded-2xl animate-pulse p-5" />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-gray-800/80 my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 text-gray-500 mb-4">
              <ListTodo className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-200">Nenhuma tarefa encontrada</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              {searchTerm || filterStatus !== 'all' || filterPriority !== 'ALL'
                ? 'Tente ajustar seus filtros de busca para encontrar o que procura.'
                : 'Você ainda não possui tarefas cadastradas. Clique em "Nova Tarefa" para adicionar!'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={handleOpenCreateModal}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl shadow-glow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Primeira Tarefa</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={handleOpenEditModal}
              />
            ))}
          </div>
        )}

      </main>

      {/* Modal for Create/Edit */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTodo}
        editingTodo={editingTodo}
      />
    </div>
  );
}
