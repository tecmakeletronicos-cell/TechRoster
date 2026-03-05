import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { PrivateRoute } from './components/PrivateRoute';
import { Home } from './pages/Home';
import { Cadastro } from './pages/Cadastro';
import { Empresa } from './pages/Empresa';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { DeveloperDetail } from './pages/DeveloperDetail';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/empresa" element={<Empresa />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/developer/:id" element={<DeveloperDetail />} />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
