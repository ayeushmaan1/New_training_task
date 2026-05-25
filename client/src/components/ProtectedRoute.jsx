import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from './ui/Loading.jsx';

export default function ProtectedRoute({ children, role = 'user' }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading label="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace state={{ from: location }} />;
  }

  if (role === 'admin' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
