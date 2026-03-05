import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Building2, Mail, Lock, Globe, User, Send, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const companySchema = z.object({
  nome: z.string().min(2, 'Nome da empresa obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().min(10, 'Descrição obrigatória'),
  contactPerson: z.string().min(3, 'Nome do contato obrigatório'),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const RegistroEmpresa: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit: SubmitHandler<CompanyFormData> = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'companies', user.uid), {
        uid: user.uid,
        nome: data.nome,
        email: data.email,
        website: data.website,
        description: data.description,
        contactPerson: data.contactPerson,
        createdAt: serverTimestamp(),
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (error?: any) => cn(
    "w-full px-4 py-4 rounded-2xl border-2 transition-all outline-none focus:ring-4 focus:ring-indigo-50 font-medium",
    error ? "border-red-200 focus:border-red-500" : "border-slate-100 focus:border-indigo-600"
  );

  const labelClasses = "block text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Perfil de Empresa</h1>
        <p className="text-slate-500 text-lg font-medium">Contrate os melhores talentos tech do mercado.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dados da Empresa</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Nome da Empresa</label>
              <input {...register('nome')} className={inputClasses(errors.nome)} placeholder="Ex: Tech Solutions" />
              {errors.nome && <p className="text-red-500 text-xs mt-2 font-bold">{errors.nome.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Website</label>
              <input {...register('website')} className={inputClasses(errors.website)} placeholder="https://empresa.com" />
              {errors.website && <p className="text-red-500 text-xs mt-2 font-bold">{errors.website.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Email Corporativo</label>
              <input {...register('email')} className={inputClasses(errors.email)} placeholder="contato@empresa.com" />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Senha de Acesso</label>
              <input type="password" {...register('password')} className={inputClasses(errors.password)} placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Pessoa de Contato</label>
              <div className="relative">
                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input {...register('contactPerson')} className={cn(inputClasses(errors.contactPerson), "pl-12")} placeholder="Ex: Maria Silva" />
              </div>
              {errors.contactPerson && <p className="text-red-500 text-xs mt-2 font-bold">{errors.contactPerson.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Descrição da Empresa</label>
              <textarea {...register('description')} rows={4} className={inputClasses(errors.description)} placeholder="Conte sobre a cultura e o que a empresa faz..."></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-2 font-bold">{errors.description.message}</p>}
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50 group"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Criar Perfil de Empresa
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
