import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAuth() {
  const { token } = useSelector(state => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet/>
}
