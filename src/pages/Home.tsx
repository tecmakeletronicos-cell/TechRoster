import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Code,
  Globe,
  Star
} from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full mb-6">
                O Futuro do Recrutamento Tech
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                CONECTANDO <span className="text-indigo-600">TALENTOS</span> <br />
                A OPORTUNIDADES <span className="italic font-serif text-slate-400">REAIS.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-10">
                TechRoster é a plataforma definitiva para desenvolvedores de elite e empresas que buscam excelência técnica. Sem ruído, apenas conexões de alto impacto.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/registro"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/talentos"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  Explorar Talentos
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8">
                <Users className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Pool de Elite</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Apenas desenvolvedores validados por nossa curadoria técnica. Qualidade acima de quantidade.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Match Inteligente</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Algoritmos que conectam skills específicas às necessidades reais das empresas.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-8">
                <ShieldCheck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Segurança Total</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Privacidade de dados e processos de contratação transparentes para ambos os lados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">5k+</div>
              <div className="text-indigo-100 font-bold uppercase text-xs tracking-widest">Devs Ativos</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">200+</div>
              <div className="text-indigo-100 font-bold uppercase text-xs tracking-widest">Empresas</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">1.2k</div>
              <div className="text-indigo-100 font-bold uppercase text-xs tracking-widest">Contratações</div>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">4.9</div>
              <div className="text-indigo-100 font-bold uppercase text-xs tracking-widest">Avaliação</div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 tracking-tighter leading-none">
              PRONTO PARA O PRÓXIMO <br />
              <span className="text-indigo-400">NÍVEL DA SUA CARREIRA?</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já transformaram suas trajetórias através do TechRoster.
            </p>
            <Link
              to="/registro"
              className="inline-flex px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-400 hover:text-white transition-all shadow-2xl"
            >
              CRIAR MINHA CONTA AGORA
            </Link>
            
            {/* Decorative icons */}
            <Code className="absolute top-10 left-10 w-12 h-12 text-white/5 -rotate-12" />
            <Globe className="absolute bottom-10 right-10 w-16 h-16 text-white/5 rotate-12" />
            <Star className="absolute top-1/2 left-1/4 w-8 h-8 text-indigo-500/20" />
          </div>
        </div>
      </section>
    </div>
  );
};
