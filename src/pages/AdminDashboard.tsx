import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Developer, DevStatus, Seniority } from '../types';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, Download, User, Star, 
  Clock, CheckCircle, AlertCircle, ChevronRight,
  BarChart3, Users, CheckSquare, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const AdminDashboard: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DevStatus | 'Todos'>('Todos');
  const [seniorityFilter, setSeniorityFilter] = useState<Seniority | 'Todos'>('Todos');

  useEffect(() => {
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

  const filteredDevelopers = developers.filter(dev => {
    const matchesSearch = dev.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dev.stack_principal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || dev.status === statusFilter;
    const matchesSeniority = seniorityFilter === 'Todos' || dev.nivel_declarado === seniorityFilter;
    
    return matchesSearch && matchesStatus && matchesSeniority;
  });

  const stats = {
    total: developers.length,
    new: developers.filter(d => d.status === 'Novo').length,
    evaluated: developers.filter(d => d.avaliado).length,
    avgScore: developers.filter(d => d.avaliado && d.score_tecnico).reduce((acc, curr) => acc + (curr.score_tecnico || 0), 0) / (developers.filter(d => d.avaliado && d.score_tecnico).length || 1)
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'WhatsApp', 'Stack', 'Nível', 'Status', 'Score', 'Data Cadastro'];
    const rows = filteredDevelopers.map(dev => [
      dev.nome,
      dev.email,
      dev.whatsapp,
      dev.stack_principal,
      dev.nivel_declarado,
      dev.status,
      dev.score_tecnico || 'N/A',
      dev.createdAt instanceof Timestamp ? format(dev.createdAt.toDate(), 'dd/MM/yyyy') : 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatos_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: DevStatus) => {
    switch (status) {
      case 'Novo': return 'bg-blue-100 text-blue-700';
      case 'Em Contato': return 'bg-yellow-100 text-yellow-700';
      case 'Entrevistado': return 'bg-purple-100 text-purple-700';
      case 'Aprovado': return 'bg-emerald-100 text-emerald-700';
      case 'Reprovado': return 'bg-red-100 text-red-700';
      case 'Contratado': return 'bg-slate-900 text-white';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Administrativo</h1>
          <p className="text-slate-500">Gerencie e avalie os candidatos do pool de talentos.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
          <p className="text-slate-500 text-sm mt-1">Candidatos inscritos</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Novos</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.new}</div>
          <p className="text-slate-500 text-sm mt-1">Aguardando contato</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avaliados</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.evaluated}</div>
          <p className="text-slate-500 text-sm mt-1">Com score técnico</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Média</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.avgScore.toFixed(1)}</div>
          <p className="text-slate-500 text-sm mt-1">Score técnico médio</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Novo">Novo</option>
            <option value="Em Contato">Em Contato</option>
            <option value="Entrevistado">Entrevistado</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
            <option value="Contratado">Contratado</option>
          </select>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
          >
            <option value="Todos">Todas Senioridades</option>
            <option value="Pleno">Pleno</option>
            <option value="Senior">Sênior</option>
          </select>
        </div>
      </div>

      {/* Developers Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Candidato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stack / Nível</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-medium">Carregando candidatos...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredDevelopers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum candidato encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredDevelopers.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{dev.nome}</div>
                          <div className="text-xs text-slate-500">{dev.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{dev.stack_principal}</div>
                      <div className="text-xs text-slate-400">{dev.nivel_declarado} • {dev.anos_experiencia_total} anos exp.</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(dev.status)}`}>
                        {dev.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {dev.avaliado ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-slate-900">{dev.score_tecnico}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Não avaliado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {dev.createdAt instanceof Timestamp ? format(dev.createdAt.toDate(), 'dd MMM yyyy', { locale: ptBR }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/developer/${dev.id}`}
                        className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm hover:underline"
                      >
                        Ver Detalhes
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
