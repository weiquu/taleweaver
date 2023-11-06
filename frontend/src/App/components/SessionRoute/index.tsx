import { useAuth } from '../../../context/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// This component is used to redirect the user to the profile page if they are already logged in
const SessionRoute = () => {
  const { loading, auth } = useAuth();
  const location = useLocation();

  return loading || !auth ? (
    <Outlet />
  ) : (
    <Navigate to={'/profile'} replace state={{ path: location.pathname }} />
  );
};

export default SessionRoute;
