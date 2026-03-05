import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { RegistroDev } from './pages/RegistroDev';
import { RegistroEmpresa } from './pages/RegistroEmpresa';
import { Talentos } from './pages/Talentos';
import { Vagas } from './pages/Vagas';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registro/dev" element={<RegistroDev />} />
            <Route path="/registro/empresa" element={<RegistroEmpresa />} />
            <Route path="/talentos" element={<Talentos />} />
            <Route path="/vagas" element={<Vagas />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/perfil" element={<div className="p-20 text-center font-black text-slate-300">Perfil em desenvolvimento...</div>} />
              <Route path="/mensagens" element={<div className="p-20 text-center font-black text-slate-300">Sistema de mensagens em desenvolvimento...</div>} />
              <Route path="/mensagens/:id" element={<div className="p-20 text-center font-black text-slate-300">Chat privado em desenvolvimento...</div>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="min-h-screen flex items-center justify-center font-black text-4xl text-slate-200">404 NOT FOUND</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
