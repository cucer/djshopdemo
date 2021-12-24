import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
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

  const [address, setAddress] = useState(vAddress);
  const [city, setCity] = useState(vCity);
  const [postalCode, setPostalCode] = useState(vPostalCode);
  const [country, setCountry] = useState(vCountry);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  // Methods
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  const handleAddressChange = (e) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  const handleCityChange = (e) => {
    e.preventDefault();
    setCity(e.target.value);
  };

  const handlePostalCodeChange = (e) => {
    e.preventDefault();
    setPostalCode(e.target.value);
  };

  const handleCountryChange = (e) => {
    e.preventDefault();
    setCountry(e.target.value);
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
            size='sm'
            placeholder='Enter address'
            value={address}
            required
            onChange={handleAddressChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            size='sm'
            placeholder='Enter city'
            value={city}
            required
            onChange={handleCityChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            size='sm'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={handlePostalCodeChange}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='mb-3' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            size='sm'
            placeholder='Enter country'
            value={country}
            required
            onChange={handleCountryChange}
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
