import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Registro: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">Escolha seu Perfil</h1>
          <p className="text-slate-500 text-lg font-medium">Como você deseja utilizar o TechRoster?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Developer Option */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-100 flex flex-col"
          >
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-indigo-100">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Desenvolvedor</h2>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3 text-slate-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Crie um perfil profissional de alto impacto</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Seja encontrado por empresas globais</span>
              </li>
              <li className="flex items-start gap-3 text-slate-600 font-medium">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>Acesso a vagas exclusivas e curadoria</span>
              </li>
            </ul>
            <Link
              to="/registro/dev"
              className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
            >
              Sou Desenvolvedor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Company Option */}
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-slate-900 p-10 rounded-[3rem] shadow-xl shadow-slate-200 border border-slate-800 flex flex-col"
          >
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-lg shadow-white/5">
              <Building2 className="w-10 h-10 text-slate-900" />
            </div>
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Empresa</h2>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Acesso ao pool de talentos validados</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Publique vagas e gerencie aplicações</span>
              </li>
              <li className="flex items-start gap-3 text-slate-400 font-medium">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0 mt-0.5" />
                <span>Filtros avançados e recrutamento ágil</span>
              </li>
            </ul>
            <Link
              to="/registro/empresa"
              className="w-full py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-400 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              Sou Empresa
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
