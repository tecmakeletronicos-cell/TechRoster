import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Developer, Seniority, DevStatus } from '../types';
import { 
  Search, 
  Filter, 
  User, 
  Star, 
  Github, 
  Linkedin, 
  Globe, 
  ChevronRight,
  MessageSquare,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Talentos: React.FC = () => {
  const { user, profile } = useAuth();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [seniorityFilter, setSeniorityFilter] = useState<Seniority | 'Todos'>('Todos');
  const [statusFilter, setStatusFilter] = useState<DevStatus | 'Todos'>('Todos');

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'developers'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const devList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Developer[];
      setDevelopers(devList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredDevs = developers.filter(dev => {
    const matchesSearch = dev.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dev.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeniority = seniorityFilter === 'Todos' || dev.seniority === seniorityFilter;
    const matchesStatus = statusFilter === 'Todos' || dev.status === statusFilter;
    
    return matchesSearch && matchesSeniority && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Explorar Talentos</h1>
        <p className="text-slate-500 text-lg font-medium">Conecte-se com os melhores desenvolvedores da comunidade.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-10 flex flex-wrap items-center gap-6">
        <div className="relative flex-grow min-w-[280px]">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou tecnologia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={seniorityFilter}
              onChange={(e) => setSeniorityFilter(e.target.value as any)}
              className="px-4 py-3 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-700"
            >
              <option value="Todos">Todas Senioridades</option>
              <option value="Junior">Junior</option>
              <option value="Pleno">Pleno</option>
              <option value="Senior">Senior</option>
              <option value="Specialist">Especialista</option>
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-700"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Available">Disponível</option>
            <option value="Open to Offers">Aberto a Propostas</option>
            <option value="Hired">Contratado</option>
          </select>
        </div>
      </div>

      {/* Dev Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-pulse">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-100 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-8"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded w-16"></div>
                  <div className="h-6 bg-slate-100 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : filteredDevs.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Nenhum talento encontrado</h3>
              <p className="text-slate-500 mt-2">Tente ajustar seus filtros de busca.</p>
            </div>
          ) : (
            filteredDevs.map((dev) => (
              <motion.div
                key={dev.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden"
              >
                {dev.isPremium && (
                  <div className="absolute top-0 right-0 px-6 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                    Premium
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {dev.photoURL ? (
                      <img src={dev.photoURL} alt={dev.nome} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {dev.githubURL && (
                      <a href={dev.githubURL} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {dev.linkedinURL && (
                      <a href={dev.linkedinURL} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-1 tracking-tight">{dev.nome}</h3>
                <p className="text-slate-500 font-bold text-sm mb-4">{dev.seniority} • {dev.experienceYears} anos exp.</p>
                
                <p className="text-slate-600 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
                  {dev.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {dev.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      {skill}
                    </span>
                  ))}
                  {dev.skills.length > 3 && (
                    <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                      +{dev.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      dev.status === 'Available' ? 'bg-emerald-500' : 
                      dev.status === 'Open to Offers' ? 'bg-amber-500' : 'bg-slate-300'
                    }`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dev.status}</span>
                  </div>
                  
                  {user ? (
                    <Link
                      to={`/mensagens/${dev.uid}`}
                      className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs hover:underline"
                    >
                      {(!dev.isPremium && profile?.role !== 'company') ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Lock className="w-3 h-3" />
                          Privado
                        </span>
                      ) : (
                        <>
                          Conversar
                          <MessageSquare className="w-4 h-4" />
                        </>
                      )}
                    </Link>
                  ) : (
                    <Link to="/login" className="text-indigo-600 font-black text-xs hover:underline">
                      Ver Perfil
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
