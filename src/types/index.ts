import { Timestamp } from 'firebase/firestore';

export type Seniority = 'Pleno' | 'Senior';
export type ContractType = 'CLT' | 'PJ' | 'Ambos';
export type DevStatus = 'Novo' | 'Em Contato' | 'Entrevistado' | 'Aprovado' | 'Reprovado' | 'Contratado';

export interface Developer {
  id?: string;
  nome: string;
  email: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url?: string;
  stack_principal: string;
  stack_secundaria: string;
  anos_experiencia_total: number;
  anos_stack_principal: number;
  nivel_declarado: Seniority;
  tipo_contrato: ContractType;
  pretensao_clt?: number;
  pretensao_pj?: number;
  disponibilidade: string;
  ultimo_projeto: string;
  maior_desafio: string;
  lideranca: boolean;
  arquitetura: boolean;
  status: DevStatus;
  avaliado: boolean;
  score_tecnico?: number;
  observacoes_internas?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface CompanyLead {
  id?: string;
  nome_empresa: string;
  nome_responsavel: string;
  email: string;
  stack_desejada: string;
  senioridade: string;
  faixa_salarial: string;
  observacoes?: string;
  createdAt: Timestamp | Date;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}
