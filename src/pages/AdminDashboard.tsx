import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Developer, Seniority, DevStatus } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  Trash2, 
  CheckCircle, 
  XCircle,
  BarChart3,
  UserCheck,
  Clock,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
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
                         dev.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeniority = seniorityFilter === 'Todos' || dev.seniority === seniorityFilter;
    const matchesStatus = statusFilter === 'Todos' || dev.status === statusFilter;
    
    return matchesSearch && matchesSeniority && matchesStatus;
  });

  const togglePremium = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'developers', id), {
      isPremium: !currentStatus,
      updatedAt: new Date()
    });
  };

  const deleteDeveloper = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este desenvolvedor?')) {
      await deleteDoc(doc(db, 'developers', id));
    }
  };

  const stats = {
    total: developers.length,
    premium: developers.filter(d => d.isPremium).length,
    available: developers.filter(d => d.status === 'Available').length,
    senior: developers.filter(d => d.seniority === 'Senior' || d.seniority === 'Specialist').length
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Painel Administrativo</h1>
        <p className="text-slate-500 text-lg font-medium">Gestão de talentos e métricas da plataforma.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Devs</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.total}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.premium}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Disponíveis</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.available}</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sênior+</span>
          </div>
          <div className="text-4xl font-black text-slate-900 tracking-tighter">{stats.senior}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-wrap items-center gap-6">
        <div className="relative flex-grow min-w-[280px]">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-4">
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

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Desenvolvedor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Senioridade</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredDevs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 font-medium">
                    Nenhum desenvolvedor encontrado.
                  </td>
                </tr>
              ) : (
                filteredDevs.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs uppercase">
                          {dev.nome.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 tracking-tight">{dev.nome}</div>
                          <div className="text-xs text-slate-400 font-medium">{dev.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg">
                        {dev.seniority}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          dev.status === 'Available' ? 'bg-emerald-500' : 
                          dev.status === 'Open to Offers' ? 'bg-amber-500' : 'bg-slate-300'
                        }`}></div>
                        <span className="text-xs font-bold text-slate-700">{dev.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => togglePremium(dev.id, dev.isPremium)}
                        className={`p-2 rounded-xl transition-all ${
                          dev.isPremium ? 'text-amber-500 bg-amber-50' : 'text-slate-300 bg-slate-50 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${dev.isPremium ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => deleteDeveloper(dev.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
