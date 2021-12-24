import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ component: RouteComponent }) => {
  // Redux
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const isAuthenticated =
    userInfo && userInfo.token && userInfo.isAdmin ? true : false;

  if (isAuthenticated) {
    return <RouteComponent />;
  }

  return <Navigate to='/404' />;
};
