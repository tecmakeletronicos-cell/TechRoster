import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { motion } from 'motion/react';
import { User, Mail, Lock, Code, Briefcase, Globe, Linkedin, Github, Send, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const devSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  skills: z.string().min(2, 'Skills obrigatórias'),
  experienceYears: z.number().min(0, 'Mínimo 0'),
  seniority: z.enum(['Junior', 'Pleno', 'Senior', 'Specialist']),
  bio: z.string().min(10, 'Bio deve ter pelo menos 10 caracteres'),
  portfolioURL: z.string().url('URL inválida').optional().or(z.literal('')),
  githubURL: z.string().url('URL inválida').optional().or(z.literal('')),
  linkedinURL: z.string().url('URL inválida').optional().or(z.literal('')),
});

type DevFormData = z.infer<typeof devSchema>;

export const RegistroDev: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DevFormData>({
    resolver: zodResolver(devSchema),
    defaultValues: {
      seniority: 'Pleno',
      experienceYears: 0,
    }
  });

  const onSubmit: SubmitHandler<DevFormData> = async (data) => {
    setIsSubmitting(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'developers', user.uid), {
        uid: user.uid,
        nome: data.nome,
        email: data.email,
        skills: data.skills.split(',').map(s => s.trim()),
        experienceYears: data.experienceYears,
        seniority: data.seniority,
        bio: data.bio,
        portfolioURL: data.portfolioURL,
        githubURL: data.githubURL,
        linkedinURL: data.linkedinURL,
        status: 'Available',
        isPremium: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Perfil de Desenvolvedor</h1>
        <p className="text-slate-500 text-lg font-medium">Crie sua conta e seja visto pelas melhores empresas.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Info */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dados Básicos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Nome Completo</label>
              <input {...register('nome')} className={inputClasses(errors.nome)} placeholder="Ex: João Silva" />
              {errors.nome && <p className="text-red-500 text-xs mt-2 font-bold">{errors.nome.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Email Profissional</label>
              <input {...register('email')} className={inputClasses(errors.email)} placeholder="joao@exemplo.com" />
              {errors.email && <p className="text-red-500 text-xs mt-2 font-bold">{errors.email.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Senha de Acesso</label>
              <input type="password" {...register('password')} className={inputClasses(errors.password)} placeholder="••••••••" />
              {errors.password && <p className="text-red-500 text-xs mt-2 font-bold">{errors.password.message}</p>}
            </div>
          </div>
        </section>

        {/* Section 2: Technical Profile */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Code className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Perfil Técnico</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className={labelClasses}>Skills (separadas por vírgula)</label>
              <input {...register('skills')} className={inputClasses(errors.skills)} placeholder="Ex: React, Node.js, TypeScript, AWS" />
              {errors.skills && <p className="text-red-500 text-xs mt-2 font-bold">{errors.skills.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Anos de Experiência</label>
              <input type="number" {...register('experienceYears', { valueAsNumber: true })} className={inputClasses(errors.experienceYears)} />
              {errors.experienceYears && <p className="text-red-500 text-xs mt-2 font-bold">{errors.experienceYears.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Senioridade</label>
              <select {...register('seniority')} className={inputClasses(errors.seniority)}>
                <option value="Junior">Junior</option>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Sênior</option>
                <option value="Specialist">Especialista</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Bio / Resumo Profissional</label>
              <textarea {...register('bio')} rows={4} className={inputClasses(errors.bio)} placeholder="Conte um pouco sobre sua trajetória..."></textarea>
              {errors.bio && <p className="text-red-500 text-xs mt-2 font-bold">{errors.bio.message}</p>}
            </div>
          </div>
        </section>

        {/* Section 3: Links */}
        <section className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
          <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-50">
            <div className="p-2.5 bg-purple-50 rounded-xl">
              <Globe className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Presença Online</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>LinkedIn URL</label>
              <input {...register('linkedinURL')} className={inputClasses(errors.linkedinURL)} placeholder="https://linkedin.com/in/perfil" />
            </div>
            <div>
              <label className={labelClasses}>GitHub URL</label>
              <input {...register('githubURL')} className={inputClasses(errors.githubURL)} placeholder="https://github.com/usuario" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Portfólio / Site Pessoal</label>
              <input {...register('portfolioURL')} className={inputClasses(errors.portfolioURL)} placeholder="https://meusite.com" />
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
                Criar Perfil de Desenvolvedor
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
