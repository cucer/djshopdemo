import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ component: RouteComponent }) => {
  // Redux
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const isAuthenticated = userInfo && userInfo.isAuthenticated ? true : false;

  if (isAuthenticated) {
    return <RouteComponent />;
  }

  return <Navigate to="/" />; // Login again
};
