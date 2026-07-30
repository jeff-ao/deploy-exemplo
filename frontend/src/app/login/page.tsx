'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckSquare, Lock, Mail, ArrowRight, Sparkles, AlertCircle, UserCheck } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/schemas';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const response = await api.post('/auth/login', data);
      const { token, user } = response.data.data;

      localStorage.setItem('@todoapp:token', token);
      localStorage.setItem('@todoapp:user', JSON.stringify(user));

      router.push('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.';
      setServerError(message);
    }
  };

  const handleFillDemo = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', '123456', { shouldValidate: true });
    setServerError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800 via-dark-900 to-black">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        
        {/* Logo Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-cyan p-0.5 shadow-glow mb-4">
            <div className="w-full h-full bg-dark-900 rounded-[14px] flex items-center justify-center">
              <CheckSquare className="w-7 h-7 text-brand-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Deploy<span className="text-brand-400">Tasks</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Acesse sua conta para gerenciar suas tarefas</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 shadow-glass">
          
          {serverError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-rose-300">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-gray-500 glass-input ${
                    errors.email ? 'border-rose-500/60 focus:border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium text-white placeholder-gray-500 glass-input ${
                    errors.password ? 'border-rose-500/60 focus:border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 mt-2 flex items-center justify-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-xl shadow-glow transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Entrando...</span>
              ) : (
                <>
                  <span>Entrar na Aplicação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Buttons (Perfeito para a aula de demonstração!) */}
          <div className="mt-6 pt-6 border-t border-gray-800/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3 text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Contas de Teste (Preenchimento Rápido)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('admin@todo.com')}
                className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Professor
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('aluno@todo.com')}
                className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-accent-cyan" /> Aluno
              </button>
            </div>
          </div>

          {/* Register Redirect */}
          <div className="mt-6 text-center text-xs text-gray-400">
            Ainda não possui uma conta?{' '}
            <Link href="/register" className="font-bold text-brand-400 hover:text-brand-300 underline underline-offset-4">
              Cadastre-se aqui
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
