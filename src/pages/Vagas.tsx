import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Job } from '../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Building2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Vagas: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobList);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Oportunidades</h1>
        <p className="text-slate-500 text-lg font-medium">As melhores vagas nas empresas mais inovadoras.</p>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cargo ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-indigo-600 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 animate-pulse">
                <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-1/4 mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-slate-100 rounded w-20"></div>
                  <div className="h-4 bg-slate-100 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Nenhuma vaga encontrada</h3>
              <p className="text-slate-500 mt-2">Tente buscar por outros termos.</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all group cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-sm">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {job.companyName}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location} ({job.type})
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-500" />
                          {job.seniority}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-3">
                    <div className="flex items-center gap-4">
                      {job.salaryRange && (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-black text-sm">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                        <Clock className="w-4 h-4" />
                        {format(job.createdAt.toDate(), 'dd MMM', { locale: ptBR })}
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-indigo-600 transition-all text-xs uppercase tracking-widest flex items-center gap-2">
                      Candidatar-se
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
