import React, { useState, useEffect } from 'react';
import { /*useDispatch,*/ useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useInput } from '../../hooks/useInput';
import FormContainer from '../../components/main/FormContainer';
import Message from '../../components/main/Message';
import Loader from '../../components/main/Loader';
// import { register } from "../../redux/actions/userActions";

const RegisterScreen = () => {
  // Redux
  // const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  // State
  const [message, setMessage] = useState(null);

  // Custom Hook (setInputs = handleChange)
  const [inputs, setInputs] = useInput({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Route
  let navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search ? location.search.split('=')[1] : '/home';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputs.password !== inputs.confirmPassword) {
      setMessage('Password does not match!');
    } else {
      alert('You have to implement your own method!');
      // dispatch(register(inputs.name, inputs.email, inputs.password));
    }
  };

  return (
    <FormContainer>
      <h1 style={{ fontSize: '2.5rem' }} className="text-info">
        Sign Up
      </h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            name="name"
            size="sm"
            placeholder="Enter name"
            value={inputs.name}
            onChange={setInputs}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            size="sm"
            placeholder="Enter email"
            value={inputs.email}
            onChange={setInputs}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            size="sm"
            placeholder="Password"
            value={inputs.password}
            onChange={setInputs}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            size="sm"
            placeholder="Confirm Password"
            value={inputs.confirmPassword}
            onChange={setInputs}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="btn btn-info"
          size="sm"
        >
          Sign Up
        </Button>
      </Form>

      <Row className="py-3">
        <Col>
          Have an account?{' '}
          <Link to={redirect ? `/?redirect=${redirect}` : '/'}>Sign in</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
