'use client';

import { Check, Trash2, Edit3, Clock, AlertCircle } from 'lucide-react';
import { Todo, Priority } from '@/lib/types';
import { useState } from 'react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

const priorityConfig: Record<Priority, { label: string; bg: string; text: string; border: string }> = {
  HIGH: {
    label: 'Alta',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  MEDIUM: {
    label: 'Média',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  LOW: {
    label: 'Baixa',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

export function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priority = priorityConfig[todo.priority] || priorityConfig.MEDIUM;

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggle(todo.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        setIsDeleting(true);
        await onDelete(todo.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={`group relative glass-card rounded-2xl p-5 border transition-all duration-200 hover:shadow-glow ${
        todo.completed
          ? 'border-gray-800/40 opacity-75 bg-dark-900/40'
          : 'border-gray-800 hover:border-gray-700/80'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Toggle Checkbox Button */}
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-accent-emerald border-accent-emerald text-dark-900 shadow-glow'
              : 'border-gray-600 hover:border-brand-400 bg-gray-800/50'
          }`}
          title={todo.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
        >
          {todo.completed && <Check className="w-4 h-4 stroke-[3]" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3
              className={`text-base font-semibold tracking-tight transition-all ${
                todo.completed
                  ? 'line-through text-gray-500'
                  : 'text-gray-100 group-hover:text-white'
              }`}
            >
              {todo.title}
            </h3>

            {/* Priority Badge */}
            <span
              className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priority.bg} ${priority.text} ${priority.border}`}
            >
              {priority.label}
            </span>
          </div>

          {todo.description && (
            <p
              className={`text-xs leading-relaxed mt-1 ${
                todo.completed ? 'text-gray-600 line-through' : 'text-gray-400'
              }`}
            >
              {todo.description}
            </p>
          )}

          {/* Footer Metadata */}
          <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(todo.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            className="p-2 text-gray-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
            title="Editar tarefa"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Excluir tarefa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
