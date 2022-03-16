import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Message from '../../components/main/Message';
import Loader from '../../components/main/Loader';
import FormContainer from '../../components/main/FormContainer';
import { getUserDetails, updateUser } from '../../redux/actions/userActions';
import { USER_UPDATE_RESET } from '../../redux/constants/userConstants';

const UserEditScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  // State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Route
  let navigate = useNavigate();
  let params = useParams();
  const userId = params.id;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    } else {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        navigate('/admin/userlist');
      } else {
        if (!user.name || user._id !== userId) {
          dispatch(getUserDetails(userId));
        } else {
          setName(user.name);
          setEmail(user.email);
          setIsAdmin(user.isAdmin);
        }
      }
    }
  }, [dispatch, navigate, userInfo, user, userId, successUpdate]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    // alert('You have to implement your own method!');
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };

  return (
    <>
      <Link to="/admin/userlist" className="btn btn-outline-info my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 style={{ fontSize: '2.5rem' }} className="text-info">
          Edit User
        </h1>
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loadingUpdate && <Loader />}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                size="sm"
                placeholder="Enter name"
                value={name}
                onChange={handleNameChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                size="sm"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label={
                  userInfo._id === userId
                    ? 'You can not change your own status!'
                    : 'Is Admin?'
                }
                checked={isAdmin}
                onChange={handleAdminChange}
                disabled={userInfo._id === userId}
              ></Form.Check>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="my-2 btn btn-info"
              size="sm"
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
