import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormContainer from "../../components/main/FormContainer";
import Loader from "../../components/main/Loader";
import Message from "../../components/main/Message";
import { login } from "../../redux/actions/userActions";

const LoginScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Route
  let navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/home";

  // First authorization control is in PrivateRoute, second one is here
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  return (
    <FormContainer>
      <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
        Sign In
      </h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            size='sm'
            placeholder='Enter email'
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            size='sm'
            placeholder='Password'
            value={password}
            onChange={handlePasswordChange}
          />
          <Form.Text className='text-muted'>
            Username: demo@demo.com Password: 123456
          </Form.Text>
        </Form.Group>

        <Button
          variant='primary'
          type='submit'
          className='my-2 btn btn-info'
          size='sm'
        >
          Sign In
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Don't have an account?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Sign up
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
