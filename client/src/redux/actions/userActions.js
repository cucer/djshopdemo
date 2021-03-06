import axios from 'axios';
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';
import {
  deleteCSRFToken,
  getCSRFTokenPOST,
  getCSRFTokenPUT,
  getCSRFTokenDELETE,
} from '../../common/commonFunctions';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Route & Method & CSRF
    await getCSRFTokenPOST();
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );
    deleteCSRFToken();

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // const storageData = (({ isAdmin, isAuthenticated, ...o }) => o)(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  localStorage.removeItem('paymentMethod');
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_LIST_RESET });

  await getCSRFTokenPOST();
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Route&Method for backend route
  await axios.post('/api/users/logout', config);
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Route & Method & CSRF
    await getCSRFTokenPOST();
    const { data } = await axios.post(
      '/api/users/register',
      { name, email, password },
      config
    );
    deleteCSRFToken();

    // First Step: register
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    // Second Step: login
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // const storageData = (({ isAdmin, isAuthenticated, ...o }) => o)(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST,
    });

    // Route&Method for backend route
    const { data } = await axios.get('/api/users');

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized!') {
      dispatch(logout());
    }
    dispatch({
      type: USER_LIST_FAIL,
      payload: message,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST,
    });

    // Route & Method & CSRF
    await getCSRFTokenDELETE();
    await axios.delete(`/api/users/${id}`);
    deleteCSRFToken();

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized!') {
      dispatch(logout());
    }
    dispatch({
      type: USER_DELETE_FAIL,
      payload: message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });

    // Route&Method for backend route
    const path = id === 'profile' ? '/api/users/profile' : `/api/users/${id}`;
    const { data } = await axios.get(path);
    // const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized!') {
      dispatch(logout());
    }
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: message,
    });
  }
};

export const updateUser = (user) => async (dispatch) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Route & Method & CSRF
    await getCSRFTokenPUT();
    const { data } = await axios.put(`/api/users/${user._id}`, user, config);
    deleteCSRFToken();

    dispatch({ type: USER_UPDATE_SUCCESS });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    dispatch({ type: USER_DETAILS_RESET });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized!') {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_FAIL,
      payload: message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Route & Method & CSRF
    await getCSRFTokenPUT();
    const { data } = await axios.put('/api/users/profile', user, config);
    deleteCSRFToken();

    dispatch({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    // We have to login
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    // const storageData = (({ isAdmin, isAuthenticated, ...o }) => o)(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized!') {
      dispatch(logout());
    }
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload: message,
    });
  }
};
