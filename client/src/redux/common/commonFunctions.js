import axios from 'axios';

export const getCSRFTokenPOST = async () => {
  const response = await axios.get('/getCSRFToken');
  axios.defaults.headers.post['X-CSRF-Token'] = response.data.csrfToken;
};

export const getCSRFTokenPUT = async () => {
  const response = await axios.get('/getCSRFToken');
  axios.defaults.headers.put['X-CSRF-Token'] = response.data.csrfToken;
};

export const getCSRFTokenDELETE = async () => {
  const response = await axios.get('/getCSRFToken');
  axios.defaults.headers.delete['X-CSRF-Token'] = response.data.csrfToken;
};

/**  DELETE TOKEN **/
export const deleteCSRFToken = async () => {
  delete axios.defaults.headers.post['X-CSRF-Token'];
  delete axios.defaults.headers.put['X-CSRF-Token'];
  delete axios.defaults.headers.delete['X-CSRF-Token'];
};
