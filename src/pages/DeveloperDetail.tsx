import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Developer, DevStatus } from '../types';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Linkedin, Github, 
  Globe, Briefcase, Code, DollarSign, Calendar, Star, 
  FileText, CheckCircle2, Save, Trash2, ExternalLink, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DeveloperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states for updates
  const [status, setStatus] = useState<DevStatus>('Novo');
  const [score, setScore] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isEvaluated, setIsEvaluated] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'developers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Developer;
          setDeveloper(data);
          setStatus(data.status);
          setScore(data.score_tecnico || 0);
          setNotes(data.observacoes_internas || '');
          setIsEvaluated(data.avaliado || false);
        } else {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error fetching developer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'developers', id);
      await updateDoc(docRef, {
        status,
        score_tecnico: Number(score),
        observacoes_internas: notes,
        avaliado: isEvaluated,
        updatedAt: serverTimestamp(),
      });
      alert('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Error updating developer:', error);
      alert('Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!developer) return null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Voltar para Lista
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{developer.nome}</h1>
                  <p className="text-slate-500 font-medium">{developer.nivel_declarado} • {developer.stack_principal}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a href={developer.linkedin_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={developer.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    {developer.portfolio_url && (
                      <a href={developer.portfolio_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-600 transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold mb-2 ${
                  developer.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                }`}>
                  {developer.status}
                </span>
                <p className="text-xs text-slate-400">
                  Cadastrado em {developer.createdAt instanceof Timestamp ? format(developer.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Contato
              </h3>
              <div className="space-y-3">
                <p className="text-slate-700 font-medium break-all">{developer.email}</p>
                <p className="text-slate-700 font-medium">{developer.whatsapp}</p>
                <p className="text-slate-700 font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {developer.cidade}, {developer.estado}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Code className="w-4 h-4" /> Perfil Técnico
              </h3>
              <div className="space-y-3">
                <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">Stack Principal:</span> {developer.stack_principal}</p>
                <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">Stack Secundária:</span> {developer.stack_secundaria}</p>
                <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">Exp. Total:</span> {developer.anos_experiencia_total} anos</p>
                <div className="flex gap-2 mt-2">
                  {developer.lideranca && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase">Liderança</span>}
                  {developer.arquitetura && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase">Arquitetura</span>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Pretensão e Contrato
              </h3>
              <div className="space-y-3">
                <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">Tipo:</span> {developer.tipo_contrato}</p>
                {developer.pretensao_clt && <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">CLT:</span> R$ {developer.pretensao_clt.toLocaleString()}</p>}
                {developer.pretensao_pj && <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">PJ:</span> R$ {developer.pretensao_pj.toLocaleString()}</p>}
                <p className="text-slate-700 font-medium"><span className="text-slate-400 font-normal">Início:</span> {developer.disponibilidade}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Experiência
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">Último Projeto</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{developer.ultimo_projeto}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Maior Desafio Técnico
            </h3>
            <p className="text-slate-700 leading-relaxed">{developer.maior_desafio}</p>
          </div>
        </div>

        {/* Right Column: Admin Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Gestão Interna
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status do Candidato</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value as DevStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium"
                >
                  <option value="Novo">Novo</option>
                  <option value="Em Contato">Em Contato</option>
                  <option value="Entrevistado">Entrevistado</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Reprovado">Reprovado</option>
                  <option value="Contratado">Contratado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Score Técnico (0-10)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.5"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="flex-grow accent-emerald-600"
                  />
                  <span className="text-2xl font-bold text-emerald-600 w-10 text-center">{score}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Observações Internas</label>
                <textarea 
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="Notas sobre a entrevista técnica, comportamento, etc..."
                ></textarea>
              </div>

              <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <input 
                  type="checkbox" 
                  checked={isEvaluated}
                  onChange={(e) => setIsEvaluated(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600" 
                />
                <span className="text-slate-700 font-bold text-sm">Marcar como Avaliado</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the icon used in the title
const ShieldCheck = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
);
