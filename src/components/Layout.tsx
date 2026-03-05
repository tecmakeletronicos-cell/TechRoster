import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { LogOut, Menu, X, Briefcase, UserPlus, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">TechRecruit</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/cadastro" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Candidatar-se</Link>
              <Link to="/empresa" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Para Empresas</Link>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full transition-all">
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-slate-600 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              ) : (
                <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Login Admin</Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-4">
            <Link to="/cadastro" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Candidatar-se</Link>
            <Link to="/empresa" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Para Empresas</Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-emerald-700 font-semibold">Admin Dashboard</Link>
            )}
            {user ? (
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="flex items-center gap-2 text-slate-600 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-medium">Login Admin</Link>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} TechRecruit Agency. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
