# TechRoster

TechRoster é uma plataforma web profissional para conexão entre desenvolvedores de elite e empresas inovadoras.

## 🚀 Tecnologias
- **Frontend:** React 19, TypeScript, TailwindCSS 4
- **Backend/BaaS:** Firebase (Authentication, Firestore)
- **Animações:** Motion
- **Ícones:** Lucide React
- **Formulários:** React Hook Form + Zod

## 🛠️ Funcionalidades
- **Cadastro de Desenvolvedores:** Perfil técnico completo, skills, bio e links sociais.
- **Cadastro de Empresas:** Perfil corporativo para publicação de vagas.
- **Dashboard Admin:** Filtros avançados por stack, senioridade e status, além de gestão de usuários Premium.
- **Sistema de Vagas:** Listagem e busca de oportunidades em tempo real.
- **Autenticação:** Proteção de rotas e persistência de sessão.

## 📦 Como Rodar Localmente
1. Clone o projeto e instale as dependências: `npm install`
2. Configure o Firebase no painel de **Secrets** do AI Studio ou em um arquivo `.env` local:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Inicie o servidor de desenvolvimento: `npm run dev`

## 🔒 Regras de Segurança (Firestore)
Recomendamos as seguintes regras para produção:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /developers/{devId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == devId;
    }
    match /companies/{compId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == compId;
    }
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null; // Adicionar check de role 'company'
    }
  }
}
```
