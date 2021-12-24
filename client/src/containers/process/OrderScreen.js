import React, { useEffect } from "react";
// import axios from "axios";
// import { PayPalButton } from "react-paypal-button-v2";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../../components/main/Message";
import Loader from "../../components/main/Loader";
import {
  getOrderDetails,
  // payOrder,
  deliverOrder,
} from "../../redux/actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../../redux/constants/orderConstants";

const OrderScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderPay = useSelector((state) => state.orderPay);
  const { /*loading: loadingPay,*/ success: successPay } = orderPay;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  // Route
  let navigate = useNavigate();
  let params = useParams();

  const orderId = params.id;

  // State
  // const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }

    /* PAYPAL
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");

      // COMMON JS
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      // Paypal SDK Script
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => {
        setSdkReady(true);
      };
      // We added Paypal script to Body dynamically
      document.body.appendChild(script);
    };
    */

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
    /* PAYPAL
      else if (!order.isPaid) {
      if (!window.paypal) {        
        addPaypalScript(); 
      } else {
        setSdkReady(true);
      }
      }
      */
  }, [
    dispatch,
    navigate,
    order,
    orderId,
    userInfo,
    successPay,
    successDeliver,
  ]);

  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const handleSuccessPayment = (paymentResult) => {
    alert("You have to implement your own method!");
    // dispatch(payOrder(orderId, paymentResult));
  };

  const handleDeliver = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
        Order
      </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 style={{ fontSize: "2rem" }} className='text-info'>
                Shipping
              </h2>
              <p>
                <strong className='text-success'>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong className='text-success'>Email: </strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong className='text-success'>Address: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered On {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered!</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ fontSize: "2rem" }} className='text-info'>
                Payment Method
              </h2>
              <p>
                <strong className='text-success'>Method:</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid On {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid!</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2 style={{ fontSize: "2rem" }} className='text-info'>
                Order Items
              </h2>
              {order.orderItems.length === 0 ? (
                <Message>Order Is Empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, i) => (
                    <ListGroup.Item key={i}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2 style={{ fontSize: "2rem" }} className='text-info'>
                  Order Summary
                </h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <span className='text-success'>Item</span>
                  </Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <span className='text-success'>Shipping</span>
                  </Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <span className='text-success'>Tax</span>
                  </Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <span className='text-success'>Total</span>
                  </Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>

              {/* {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={handleSuccessPayment}
                    />
                  )}
                </ListGroup.Item>
              )} */}
              <Button
                type='button'
                className='btn btn-block btn-info'
                onClick={handleSuccessPayment}
              >
                Pay Button
              </Button>
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={handleDeliver}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
