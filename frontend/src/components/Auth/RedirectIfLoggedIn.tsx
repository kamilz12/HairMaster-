import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface RedirectIfLoggedInProps {
  children: React.ReactNode;
  to?: string; // default redirect to "/"
}

const RedirectIfLoggedIn = ({ children, to = '/' }: RedirectIfLoggedInProps) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  if (user) {
    return <Navigate to={to} replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;
