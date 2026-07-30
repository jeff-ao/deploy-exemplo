'use client';

import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { Todo } from '@/lib/types';

interface StatsHeaderProps {
  todos: Todo[];
}

export function StatsHeader({ todos }: StatsHeaderProps) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => t.priority === 'HIGH' && !t.completed).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Total */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-gray-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</span>
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
            <ListTodo className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{total}</p>
        <p className="text-[11px] text-gray-400 mt-1">tarefas cadastradas</p>
      </div>

      {/* Concluídas */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-gray-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Concluídas</span>
          <div className="p-2 rounded-xl bg-accent-emerald/10 text-accent-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{completed}</p>
        <p className="text-[11px] text-accent-emerald font-medium mt-1">
          {total > 0 ? `${Math.round((completed / total) * 100)}% concluído` : 'nenhuma tarefa'}
        </p>
      </div>

      {/* Pendentes */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-gray-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pendentes</span>
          <div className="p-2 rounded-xl bg-accent-amber/10 text-accent-amber">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{pending}</p>
        <p className="text-[11px] text-gray-400 mt-1">aguardando finalização</p>
      </div>

      {/* Alta Prioridade */}
      <div className="glass-card p-4 rounded-2xl border border-gray-800/80 hover:border-gray-700/80 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Urgentes</span>
          <div className="p-2 rounded-xl bg-accent-rose/10 text-accent-rose">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-white mt-2">{highPriority}</p>
        <p className="text-[11px] text-accent-rose font-medium mt-1">prioridade alta pendente</p>
      </div>
    </div>
  );
}
