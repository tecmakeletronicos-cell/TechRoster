import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Code2, Users, Rocket, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-emerald-700 uppercase bg-emerald-50 rounded-full">
                Recrutamento Tech de Elite
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-[1.1]">
                Conectamos os melhores <span className="text-emerald-600">Fullstack Devs</span> a empresas globais.
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Especializados em talentos Pleno e Sênior. Processo rigoroso, curadoria humana e foco em resultados técnicos excepcionais.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/cadastro"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
                >
                  Cadastrar como Desenvolvedor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/empresa"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-200 hover:border-emerald-600 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  Sou Empresa
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Foco Fullstack</h3>
              <p className="text-slate-600 leading-relaxed">
                Nossa expertise é profunda em stacks modernas: React, Node.js, TypeScript, Go, Python e Cloud.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Curadoria Sênior</h3>
              <p className="text-slate-600 leading-relaxed">
                Avaliamos não apenas código, mas arquitetura, liderança e soft skills essenciais para níveis Pleno e Sênior.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Match Perfeito</h3>
              <p className="text-slate-600 leading-relaxed">
                Reduzimos o tempo de contratação em até 60% entregando candidatos pré-validados e alinhados à cultura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24">
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">500+</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Devs Alocados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">150+</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Empresas Parceiras</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">98%</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Taxa de Retenção</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">15d</div>
              <div className="text-slate-500 font-medium uppercase tracking-wider text-sm">Tempo Médio de Contratação</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
