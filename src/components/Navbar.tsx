import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { 
  Users, 
  Briefcase, 
  MessageSquare, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Talentos', path: '/talentos', icon: Users },
    { name: 'Vagas', path: '/vagas', icon: Briefcase },
  ];

  if (user) {
    navLinks.push({ name: 'Mensagens', path: '/mensagens', icon: MessageSquare });
    if (role === 'admin') {
      navLinks.push({ name: 'Admin', path: '/admin', icon: LayoutDashboard });
    }
  }

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic">TR</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">TechRoster</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-100">
                <Link
                  to="/perfil"
                  className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-slate-600 font-semibold text-sm">Entrar</Link>
                <Link
                  to="/registro"
                  className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-50 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl flex items-center gap-3"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/perfil"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl flex items-center gap-3"
                  >
                    <UserIcon className="w-5 h-5" />
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center text-slate-600 font-bold border border-slate-200 rounded-xl"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/registro"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center bg-indigo-600 text-white font-bold rounded-xl"
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
