import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../services/firebase';
import { UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  profile: any | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  profile: null,
  loading: true,
  isFirebaseConfigured: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Try to fetch profile from developers or companies
        const devDoc = await getDoc(doc(db, 'developers', firebaseUser.uid));
        if (devDoc.exists()) {
          setRole('developer');
          setProfile(devDoc.data());
        } else {
          const compDoc = await getDoc(doc(db, 'companies', firebaseUser.uid));
          if (compDoc.exists()) {
            setRole('company');
            setProfile(compDoc.data());
          } else {
            // Check if admin (simple check for demo, usually custom claims)
            if (firebaseUser.email === 'admin@techroster.com') {
              setRole('admin');
            } else {
              setRole(null);
            }
            setProfile(null);
          }
        }
      } else {
        setRole(null);
        setProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (!isFirebaseConfigured && !loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center">
        <div className="max-w-md bg-white p-8 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Configuração do Firebase</h2>
          <p className="text-slate-600 mb-6">
            O TechRoster precisa das chaves do Firebase para funcionar. Configure as variáveis de ambiente no painel de <strong>Secrets</strong>.
          </p>
          <div className="text-left bg-slate-50 p-4 rounded-xl text-xs font-mono text-slate-500 overflow-x-auto">
            VITE_FIREBASE_API_KEY<br/>
            VITE_FIREBASE_AUTH_DOMAIN<br/>
            VITE_FIREBASE_PROJECT_ID<br/>
            ...
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, role, profile, loading, isFirebaseConfigured }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
