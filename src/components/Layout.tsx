import React from 'react';
import { Navbar } from './Navbar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm italic">TR</span>
              </div>
              <span className="text-lg font-black text-slate-900 tracking-tighter">TechRoster</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Sobre</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Termos</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contato</a>
            </div>
            <p className="text-slate-400 text-xs">© 2026 TechRoster. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
