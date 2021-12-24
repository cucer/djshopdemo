import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Message from "../../components/main/Message";
import { addToCart, removeFromCart } from "../../redux/actions/cartActions";

const CartScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Route
  let navigate = useNavigate();
  let params = useParams();
  let location = useLocation();
  const productId = params.id;

  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  // Methods
  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    navigate("/shipping");
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else {
      if (productId) {
        dispatch(addToCart(productId, qty));
      }
    }
  }, [dispatch, navigate, userInfo, productId, qty]);

  return (
    <Row>
      <Col md={12}>
        <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
          Shopping Cart
        </h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty
            <span className='mx-2'>
              <Link to='/'>Go Back</Link>
            </span>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3} lg={2}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2} lg={1}>
                    ${item.price}
                  </Col>
                  <Col md={2} lg={1}>
                    <Form.Control
                      as='select'
                      size='sm'
                      className='bg-primary'
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} lg={1}>
                    <Button
                      type='button'
                      variant='light'
                      size='sm'
                      onClick={() => handleRemoveFromCart(item.product)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={12} className='mt-4'>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4 style={{ fontSize: "1.25rem" }} className='text-info'>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h4>
              <span className='text-success'>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </span>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block btn-info'
                size='sm'
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Proceed to checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
