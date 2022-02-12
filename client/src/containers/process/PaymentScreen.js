import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Col } from "react-bootstrap";
import FormContainer from "../../components/main/FormContainer";
import CheckoutSteps from "../../components/main/CheckoutSteps";
import { savePaymentMethod } from "../../redux/actions/cartActions";

const PaymentScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Route
  let navigate = useNavigate();

  // State
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [navigate, userInfo, shippingAddress]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  const handlePaymentMethod = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
        Payment
      </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3'>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked
              onChange={handlePaymentMethod}
            ></Form.Check>

            <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={handlePaymentMethod}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button
          type='submit'
          variant='primary'
          size='sm'
          className='my-2 btn btn-info'
        >
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
