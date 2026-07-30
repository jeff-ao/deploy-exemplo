'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Edit3, AlertCircle } from 'lucide-react';
import { todoSchema, TodoFormData } from '@/lib/schemas';
import { Todo } from '@/lib/types';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoFormData) => Promise<void>;
  editingTodo: Todo | null;
}

export function TodoModal({ isOpen, onClose, onSubmit, editingTodo }: TodoModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
    },
  });

  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        description: editingTodo.description || '',
        priority: editingTodo.priority,
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
      });
    }
  }, [editingTodo, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: TodoFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-gray-700/60 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {editingTodo ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editingTodo ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h2>
              <p className="text-xs text-gray-400">
                {editingTodo ? 'Altere as informações da sua tarefa' : 'Preencha os campos abaixo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form with Zod validation */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 mt-6">
          
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Título da Tarefa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Subir banco de dados no Render"
              {...register('title')}
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-gray-500 glass-input ${
                errors.title ? 'border-rose-500/60 focus:border-rose-500' : ''
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-xs text-rose-400 mt-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Adicione detalhes adicionais sobre o que precisa ser feito..."
              {...register('description')}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-gray-500 glass-input resize-none"
            />
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Prioridade
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'LOW', label: 'Baixa', color: 'peer-checked:border-emerald-500 peer-checked:bg-emerald-500/10 peer-checked:text-emerald-400' },
                { value: 'MEDIUM', label: 'Média', color: 'peer-checked:border-amber-500 peer-checked:bg-amber-500/10 peer-checked:text-amber-400' },
                { value: 'HIGH', label: 'Alta', color: 'peer-checked:border-rose-500 peer-checked:bg-rose-500/10 peer-checked:text-rose-400' },
              ].map((p) => (
                <label key={p.value} className="relative cursor-pointer">
                  <input
                    type="radio"
                    value={p.value}
                    {...register('priority')}
                    className="sr-only peer"
                  />
                  <div className={`p-3 rounded-xl text-center border border-gray-700/60 text-xs font-bold text-gray-400 transition-all ${p.color}`}>
                    {p.label}
                  </div>
                </label>
              ))}
            </div>
            {errors.priority && (
              <p className="text-xs text-rose-400 mt-1">{errors.priority.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold text-gray-400 hover:text-white bg-gray-800/60 hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-xl shadow-glow transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Salvando...</span>
              ) : editingTodo ? (
                <span>Atualizar Tarefa</span>
              ) : (
                <span>Criar Tarefa</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
