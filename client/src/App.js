import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import ReactGa from "react-ga";
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";
import { PrivateRoute } from "./components/route/PrivateRoute";
import { AdminRoute } from "./components/route/AdminRoute";
import LoginScreen from "./containers/auth/LoginScreen";
import RegisterScreen from "./containers/auth/RegisterScreen";
import HomeScreen from "./containers/HomeScreen";
import UserListScreen from "./containers/user/UserListScreen";
import UserEditScreen from "./containers/user/UserEditScreen";
import ProfileScreen from "./containers/user/ProfileScreen";
import ProductListScreen from "./containers/product/ProductListScreen";
import ProductCreateScreen from "./containers/product/ProductCreateScreen";
import ProductEditScreen from "./containers/product/ProductEditScreen";
import ProductScreen from "./containers/product/ProductScreen";
import CartScreen from "./containers/process/CartScreen";
import ShippingScreen from "./containers/process/ShippingScreen";
import PaymentScreen from "./containers/process/PaymentScreen";
import PlaceOrderScreen from "./containers/process/PlaceOrderScreen";
import OrderScreen from "./containers/process/OrderScreen";
import OrderListScreen from "./containers/process/OrderListScreen";

const App = () => {
  useEffect(() => {
    ReactGa.initialize("UA-62711254-5");
    ReactGa.pageview("/djshopdemo");
  }, []);

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            {/* Private Routes */}
            <Route
              path='/order/:id'
              element={<PrivateRoute component={OrderScreen} />}
            />
            <Route
              path='/placeorder'
              element={<PrivateRoute component={PlaceOrderScreen} />}
            />
            <Route
              path='/payment'
              element={<PrivateRoute component={PaymentScreen} />}
            />
            <Route
              path='/shipping'
              element={<PrivateRoute component={ShippingScreen} />}
            />
            <Route
              path='/cart'
              element={<PrivateRoute component={CartScreen} />}
            />
            <Route
              path='/cart/:id'
              element={<PrivateRoute component={CartScreen} />}
            />
            <Route
              path='/product/:id'
              element={<PrivateRoute component={ProductScreen} />}
            />
            <Route
              path='/profile'
              element={<PrivateRoute component={ProfileScreen} />}
            />
            <Route
              path='/search/:keyword'
              element={<PrivateRoute component={HomeScreen} />}
              exact
            />
            <Route
              path='/page/:pageNumber'
              element={<PrivateRoute component={HomeScreen} />}
            />
            <Route
              path='/search/:keyword/page/:pageNumber'
              element={<PrivateRoute component={HomeScreen} />}
            />
            <Route
              path='/home'
              element={<PrivateRoute component={HomeScreen} />}
            />

            {/* Admin Routes */}
            <Route
              path='/admin/orderlist'
              element={<AdminRoute component={OrderListScreen} />}
            />
            <Route
              path='/admin/userlist'
              element={<AdminRoute component={UserListScreen} />}
            />
            <Route
              path='/admin/user/:id/edit'
              element={<AdminRoute component={UserEditScreen} />}
            />
            <Route
              exact
              path='/admin/productlist'
              element={<AdminRoute component={ProductListScreen} />}
            />
            <Route
              exact
              path='/admin/productlist/:pageNumber'
              element={<AdminRoute component={ProductListScreen} />}
            />
            <Route
              exact
              path='/admin/product/create'
              element={<AdminRoute component={ProductCreateScreen} />}
            />
            <Route
              exact
              path='/admin/product/:id/edit'
              element={<AdminRoute component={ProductEditScreen} />}
            />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
