import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { useInput } from "../../hooks/useInput";
import FormContainer from "../../components/main/FormContainer";
import CheckoutSteps from "../../components/main/CheckoutSteps";
import { saveShippingAddress } from "../../redux/actions/cartActions";

const ShippingScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Route
  let navigate = useNavigate();

  // State
  const vAddress = shippingAddress.address ? shippingAddress.address : "";
  const vCity = shippingAddress.city ? shippingAddress.city : "";
  const vPostalCode = shippingAddress.postalCode
    ? shippingAddress.postalCode
    : "";
  const vCountry = shippingAddress.country ? shippingAddress.country : "";

  // Custom Hook (setInputs = handleChange)
  const [inputs, setInputs] = useInput({
    address: vAddress,
    city: vCity,
    postalCode: vPostalCode,
    country: vCountry,
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address: inputs.address,
        city: inputs.city,
        postalCode: inputs.postalCode,
        country: inputs.country,
      })
    );
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 />
      <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
        Shipping
      </h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='mb-3' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            name='address'
            size='sm'
            placeholder='Enter address'
            value={inputs.address}
            required
            onChange={setInputs}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            name='city'
            size='sm'
            placeholder='Enter city'
            value={inputs.city}
            required
            onChange={setInputs}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            name='postalCode'
            size='sm'
            placeholder='Enter postal code'
            value={inputs.postalCode}
            required
            onChange={setInputs}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            name='country'
            size='sm'
            placeholder='Enter country'
            value={inputs.country}
            required
            onChange={setInputs}
          ></Form.Control>
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

export default ShippingScreen;
