import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormContainer from "../../components/main/FormContainer";
import Message from "../../components/main/Message";
import Loader from "../../components/main/Loader";
import { register } from "../../redux/actions/userActions";

const RegisterScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  // Route
  let navigate = useNavigate();
  let location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/home";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Password does not match!");
    } else {
      alert("You have to implement your own method!");
      // dispatch(register(name, email, password));
    }
  };

  const handleNameChange = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    e.preventDefault();
    setConfirmPassword(e.target.value);
  };

  return (
    <FormContainer>
      <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
        Sign Up
      </h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            size='sm'
            placeholder='Enter name'
            value={name}
            onChange={handleNameChange}
          />
        </Form.Group>

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
        </Form.Group>

        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            size='sm'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
        </Form.Group>

        <Button
          variant='primary'
          type='submit'
          className='btn btn-info'
          size='sm'
        >
          Sign Up
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an account?{" "}
          <Link to={redirect ? `/?redirect=${redirect}` : "/"}>Sign in</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
