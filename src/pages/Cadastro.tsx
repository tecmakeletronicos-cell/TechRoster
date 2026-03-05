import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'motion/react';
import { CheckCircle2, User, Code, Briefcase, DollarSign, Send, MapPin, Phone, Mail, Linkedin, Github, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const developerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().min(10, 'Whatsapp inválido'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.string().length(2, 'Estado (UF) deve ter 2 caracteres'),
  linkedin_url: z.string().url('URL do LinkedIn inválida'),
  github_url: z.string().url('URL do GitHub inválida'),
  portfolio_url: z.string().url('URL do Portfólio inválida').optional().or(z.literal('')),
  stack_principal: z.string().min(2, 'Stack principal obrigatória'),
  stack_secundaria: z.string().min(2, 'Stack secundária obrigatória'),
  anos_experiencia_total: z.number().min(0, 'Mínimo 0'),
  anos_stack_principal: z.number().min(0, 'Mínimo 0'),
  nivel_declarado: z.enum(['Pleno', 'Senior']),
  tipo_contrato: z.enum(['CLT', 'PJ', 'Ambos']),
  pretensao_clt: z.number().optional(),
  pretensao_pj: z.number().optional(),
  disponibilidade: z.string().min(2, 'Disponibilidade obrigatória'),
  ultimo_projeto: z.string().min(10, 'Descreva seu último projeto'),
  maior_desafio: z.string().min(10, 'Descreva seu maior desafio'),
  lideranca: z.boolean(),
  arquitetura: z.boolean(),
});

type DeveloperFormData = z.infer<typeof developerSchema>;

export const Cadastro: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      lideranca: false,
      arquitetura: false,
      nivel_declarado: 'Pleno',
      tipo_contrato: 'Ambos',
      anos_experiencia_total: 0,
      anos_stack_principal: 0,
    }
  });

  const onSubmit: any = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'developers'), {
        ...data,
        status: 'Novo',
        avaliado: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding developer:', error);
      alert('Erro ao enviar cadastro. Tente novamente.');
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Cadastro Recebido!</h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Obrigado por se cadastrar na TechRecruit. Nossa equipe de especialistas analisará seu perfil e entrará em contato em breve para os próximos passos.
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Junte-se ao nosso Pool de Talentos</h1>
        <p className="text-slate-600 text-lg">Preencha o formulário abaixo para ser avaliado por nossos especialistas.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Seção 1: Dados Pessoais */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Dados Pessoais</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Nome Completo</label>
              <input {...register('nome')} className={inputClasses(errors.nome)} placeholder="Ex: João Silva" />
              {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Email Profissional</label>
              <input {...register('email')} className={inputClasses(errors.email)} placeholder="joao@exemplo.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>WhatsApp (com DDD)</label>
              <input {...register('whatsapp')} className={inputClasses(errors.whatsapp)} placeholder="(11) 99999-9999" />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className={labelClasses}>Cidade</label>
                <input {...register('cidade')} className={inputClasses(errors.cidade)} placeholder="Ex: São Paulo" />
                {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
              </div>
              <div>
                <label className={labelClasses}>Estado (UF)</label>
                <input {...register('estado')} maxLength={2} className={inputClasses(errors.estado)} placeholder="SP" />
                {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Seção 2: Links e Redes */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Presença Online</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>LinkedIn URL</label>
              <input {...register('linkedin_url')} className={inputClasses(errors.linkedin_url)} placeholder="https://linkedin.com/in/perfil" />
              {errors.linkedin_url && <p className="text-red-500 text-xs mt-1">{errors.linkedin_url.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>GitHub URL</label>
              <input {...register('github_url')} className={inputClasses(errors.github_url)} placeholder="https://github.com/usuario" />
              {errors.github_url && <p className="text-red-500 text-xs mt-1">{errors.github_url.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Portfólio / Site Pessoal (Opcional)</label>
              <input {...register('portfolio_url')} className={inputClasses(errors.portfolio_url)} placeholder="https://meusite.com" />
              {errors.portfolio_url && <p className="text-red-500 text-xs mt-1">{errors.portfolio_url.message}</p>}
            </div>
          </div>
        </section>

        {/* Seção 3: Perfil Técnico */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Code className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Perfil Técnico</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Stack Principal</label>
              <input {...register('stack_principal')} className={inputClasses(errors.stack_principal)} placeholder="Ex: React, Node.js, TypeScript" />
              {errors.stack_principal && <p className="text-red-500 text-xs mt-1">{errors.stack_principal.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Stack Secundária / Outras</label>
              <input {...register('stack_secundaria')} className={inputClasses(errors.stack_secundaria)} placeholder="Ex: Go, Python, AWS" />
              {errors.stack_secundaria && <p className="text-red-500 text-xs mt-1">{errors.stack_secundaria.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Anos de Experiência Total</label>
              <input type="number" {...register('anos_experiencia_total', { valueAsNumber: true })} className={inputClasses(errors.anos_experiencia_total)} />
              {errors.anos_experiencia_total && <p className="text-red-500 text-xs mt-1">{errors.anos_experiencia_total.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Anos na Stack Principal</label>
              <input type="number" {...register('anos_stack_principal', { valueAsNumber: true })} className={inputClasses(errors.anos_stack_principal)} />
              {errors.anos_stack_principal && <p className="text-red-500 text-xs mt-1">{errors.anos_stack_principal.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Nível Declarado</label>
              <select {...register('nivel_declarado')} className={inputClasses(errors.nivel_declarado)}>
                <option value="Pleno">Pleno</option>
                <option value="Senior">Sênior</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Disponibilidade para Início</label>
              <input {...register('disponibilidade')} className={inputClasses(errors.disponibilidade)} placeholder="Ex: Imediata, 2 semanas" />
            </div>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <label className="flex items-center gap-3 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-all">
              <input type="checkbox" {...register('lideranca')} className="w-5 h-5 accent-emerald-600" />
              <span className="text-slate-700 font-medium">Tenho experiência com Liderança Técnica</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-slate-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-all">
              <input type="checkbox" {...register('arquitetura')} className="w-5 h-5 accent-emerald-600" />
              <span className="text-slate-700 font-medium">Tenho experiência com Arquitetura de Sistemas</span>
            </label>
          </div>
        </section>

        {/* Seção 4: Experiência e Desafios */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Experiência Recente</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Resumo do Último Projeto Relevante</label>
              <textarea
                {...register('ultimo_projeto')}
                rows={4}
                className={inputClasses(errors.ultimo_projeto)}
                placeholder="Descreva as tecnologias usadas, seu papel e o resultado do projeto..."
              ></textarea>
              {errors.ultimo_projeto && <p className="text-red-500 text-xs mt-1">{errors.ultimo_projeto.message}</p>}
            </div>
            <div>
              <label className={labelClasses}>Qual foi seu maior desafio técnico até hoje?</label>
              <textarea
                {...register('maior_desafio')}
                rows={4}
                className={inputClasses(errors.maior_desafio)}
                placeholder="Como você resolveu e o que aprendeu?"
              ></textarea>
              {errors.maior_desafio && <p className="text-red-500 text-xs mt-1">{errors.maior_desafio.message}</p>}
            </div>
          </div>
        </section>

        {/* Seção 5: Pretensão e Contrato */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Pretensão Salarial</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Tipo de Contrato Preferencial</label>
              <select {...register('tipo_contrato')} className={inputClasses(errors.tipo_contrato)}>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Pretensão CLT (R$)</label>
                <input type="number" {...register('pretensao_clt', { valueAsNumber: true })} className={inputClasses(errors.pretensao_clt)} placeholder="Ex: 12000" />
              </div>
              <div>
                <label className={labelClasses}>Pretensão PJ (R$)</label>
                <input type="number" {...register('pretensao_pj', { valueAsNumber: true })} className={inputClasses(errors.pretensao_pj)} placeholder="Ex: 18000" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Enviar Cadastro
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
