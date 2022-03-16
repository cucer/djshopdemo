import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ReactGa from 'react-ga';
import Header from './components/main/Header';
import Footer from './components/main/Footer';
import Loader from './components/main/Loader';
import { PrivateRoute } from './components/route/PrivateRoute';
import { AdminRoute } from './components/route/AdminRoute';

const NotFoundScreen = React.lazy(() =>
  import('./containers/auth/NotFoundScreen')
);
const LoginScreen = React.lazy(() => import('./containers/auth/LoginScreen'));
const RegisterScreen = React.lazy(() =>
  import('./containers/auth/RegisterScreen')
);
const HomeScreen = React.lazy(() => import('./containers/HomeScreen'));
const UserListScreen = React.lazy(() =>
  import('./containers/user/UserListScreen')
);
const UserEditScreen = React.lazy(() =>
  import('./containers/user/UserEditScreen')
);
const ProfileScreen = React.lazy(() =>
  import('./containers/user/ProfileScreen')
);
const ProductListScreen = React.lazy(() =>
  import('./containers/product/ProductListScreen')
);
const ProductCreateScreen = React.lazy(() =>
  import('./containers/product/ProductCreateScreen')
);
const ProductEditScreen = React.lazy(() =>
  import('./containers/product/ProductEditScreen')
);
const ProductScreen = React.lazy(() =>
  import('./containers/product/ProductScreen')
);
const CartScreen = React.lazy(() => import('./containers/process/CartScreen'));
const ShippingScreen = React.lazy(() =>
  import('./containers/process/ShippingScreen')
);
const PaymentScreen = React.lazy(() =>
  import('./containers/process/PaymentScreen')
);
const PlaceOrderScreen = React.lazy(() =>
  import('./containers/process/PlaceOrderScreen')
);
const OrderScreen = React.lazy(() =>
  import('./containers/process/OrderScreen')
);
const OrderListScreen = React.lazy(() =>
  import('./containers/process/OrderListScreen')
);

const App = () => {
  // Redux
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    ReactGa.initialize('UA-62711254-5');
    ReactGa.pageview('/djshopdemo');
  }, []);

  return (
    <Router>
      <Suspense fallback={userInfo ? <Header /> : <Loader />}>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="*" element={<NotFoundScreen />} />
              <Route path="/404" element={<NotFoundScreen />} />
              <Route path="/" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              {/* Private Routes */}
              <Route
                path="/order/:id"
                element={<PrivateRoute component={OrderScreen} />}
              />
              <Route
                path="/placeorder"
                element={<PrivateRoute component={PlaceOrderScreen} />}
              />
              <Route
                path="/payment"
                element={<PrivateRoute component={PaymentScreen} />}
              />
              <Route
                path="/shipping"
                element={<PrivateRoute component={ShippingScreen} />}
              />
              <Route
                path="/cart"
                element={<PrivateRoute component={CartScreen} />}
              />
              <Route
                path="/cart/:id"
                element={<PrivateRoute component={CartScreen} />}
              />
              <Route
                path="/product/:id"
                element={<PrivateRoute component={ProductScreen} />}
              />
              <Route
                path="/profile"
                element={<PrivateRoute component={ProfileScreen} />}
              />
              <Route
                path="/search/:keyword"
                element={<PrivateRoute component={HomeScreen} />}
                exact
              />
              <Route
                path="/page/:pageNumber"
                element={<PrivateRoute component={HomeScreen} />}
              />
              <Route
                path="/search/:keyword/page/:pageNumber"
                element={<PrivateRoute component={HomeScreen} />}
              />
              <Route
                path="/home"
                element={<PrivateRoute component={HomeScreen} />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/orderlist"
                element={<AdminRoute component={OrderListScreen} />}
              />
              <Route
                path="/admin/userlist"
                element={<AdminRoute component={UserListScreen} />}
              />
              <Route
                path="/admin/user/:id/edit"
                element={<AdminRoute component={UserEditScreen} />}
              />
              <Route
                exact
                path="/admin/productlist"
                element={<AdminRoute component={ProductListScreen} />}
              />
              <Route
                exact
                path="/admin/productlist/:pageNumber"
                element={<AdminRoute component={ProductListScreen} />}
              />
              <Route
                exact
                path="/admin/product/create"
                element={<AdminRoute component={ProductCreateScreen} />}
              />
              <Route
                exact
                path="/admin/product/:id/edit"
                element={<AdminRoute component={ProductEditScreen} />}
              />
            </Routes>
          </Container>
        </main>
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
