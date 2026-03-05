import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'motion/react';
import { CheckCircle2, Building2, User, Mail, MessageSquare, Send, Briefcase } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const companySchema = z.object({
  nome_empresa: z.string().min(2, 'Nome da empresa obrigatório'),
  nome_responsavel: z.string().min(3, 'Nome do responsável obrigatório'),
  email: z.string().email('Email inválido'),
  stack_desejada: z.string().min(2, 'Stack desejada obrigatória'),
  senioridade: z.string().min(2, 'Senioridade obrigatória'),
  faixa_salarial: z.string().min(2, 'Faixa salarial obrigatória'),
  observacoes: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const Empresa: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'company_leads'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding company lead:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-3xl shadow-xl border border-emerald-100"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Solicitação Enviada!</h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Recebemos sua solicitação. Um de nossos consultores entrará em contato em até 24 horas para entender melhor sua necessidade e apresentar os melhores talentos.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
          >
            Voltar para Home
          </button>
        </motion.div>
      </div>
    );
  }

  const inputClasses = (error?: any) => cn(
    "w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 focus:ring-emerald-100",
    error ? "border-red-200 focus:border-red-500" : "border-slate-100 focus:border-emerald-500"
  );

  const labelClasses = "block text-sm font-bold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Encontre o Talento Certo</h1>
        <p className="text-slate-600 text-lg">Preencha os dados da sua vaga e nós cuidaremos do resto.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input {...register('nome_empresa')} className={cn(inputClasses(errors.nome_empresa), "pl-12")} placeholder="Ex: Tech Solutions" />
                </div>
                {errors.nome_empresa && <p className="text-red-500 text-xs mt-1">{errors.nome_empresa.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Nome do Responsável</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input {...register('nome_responsavel')} className={cn(inputClasses(errors.nome_responsavel), "pl-12")} placeholder="Ex: Maria Silva" />
                </div>
                {errors.nome_responsavel && <p className="text-red-500 text-xs mt-1">{errors.nome_responsavel.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Email Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input {...register('email')} className={cn(inputClasses(errors.email), "pl-12")} placeholder="maria@empresa.com" />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Stack Desejada</label>
                <input {...register('stack_desejada')} className={inputClasses(errors.stack_desejada)} placeholder="Ex: React, Node.js" />
                {errors.stack_desejada && <p className="text-red-500 text-xs mt-1">{errors.stack_desejada.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Senioridade</label>
                <select {...register('senioridade')} className={inputClasses(errors.senioridade)}>
                  <option value="">Selecione...</option>
                  <option value="Pleno">Pleno</option>
                  <option value="Senior">Sênior</option>
                  <option value="Ambos">Ambos</option>
                </select>
                {errors.senioridade && <p className="text-red-500 text-xs mt-1">{errors.senioridade.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Faixa Salarial Prevista</label>
                <input {...register('faixa_salarial')} className={inputClasses(errors.faixa_salarial)} placeholder="Ex: R$ 12k - 15k" />
                {errors.faixa_salarial && <p className="text-red-500 text-xs mt-1">{errors.faixa_salarial.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className={labelClasses}>Observações Adicionais</label>
                <textarea {...register('observacoes')} rows={4} className={inputClasses()} placeholder="Conte-nos mais sobre o projeto ou requisitos específicos..."></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Solicitar Talentos
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-6">Por que a TechRecruit?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <span>Acesso a talentos passivos que não estão no LinkedIn.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <span>Avaliação técnica rigorosa feita por especialistas.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <span>Garantia de substituição em até 90 dias.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <span>Foco exclusivo em Fullstack Pleno e Sênior.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Fale Conosco</h3>
            </div>
            <p className="text-slate-600 text-sm mb-4">Prefere uma conversa direta? Agende uma call com nosso time comercial.</p>
            <a href="mailto:comercial@techrecruit.com" className="text-emerald-700 font-bold hover:underline">comercial@techrecruit.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};
