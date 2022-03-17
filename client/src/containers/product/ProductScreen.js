import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import Rating from '../../components/main/Rating';
import Message from '../../components/main/Message';
import Loader from '../../components/main/Loader';
import Meta from '../../components/main/Meta';
import {
  listProductDetails,
  createProductReview,
} from '../../redux/actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../../redux/constants/productConstants';

const ProductScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  // State
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  let navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      if (successProductReview) {
        alert('Review submitted');
        setRating(0);
        setComment('');
      }
      if (!product._id || product._id !== params.id) {
        dispatch(listProductDetails(params.id));
        dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      }
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    params.id,
    product._id,
    successProductReview,
  ]);

  // Methods
  const handleAddToCart = () => {
    navigate(`/cart/${params.id}?qty=${qty}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(params.id, {
        rating,
        comment,
      })
    );
  };

  const handleQtyChange = (e) => {
    setQty(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <>
      <Link className="btn btn-outline-info my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3 className="mt-2" style={{ fontSize: '1.5rem' }}>
                    {product.name}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="text-success">Price: </span>${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  <span className="text-success">Description: </span>
                  <span style={{ fontSize: '0.9rem' }}>
                    {product.description}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={2}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <span className="text-success">Price: </span>
                      </Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <span className="text-success">Status: </span>
                      </Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <span className="text-success">Quantity: </span>
                        </Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={handleQtyChange}
                            size="sm"
                          >
                            {/* [...Array(product.countInStock).keys()]  >>> if there are 5 items in array it looks like  [0,1,2,3,4] */}
                            {/* Array starts with 0. So we need minimum 1 element. We added x+1 */}
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block btn-info"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2 className="mt-3 text-info" style={{ fontSize: '2rem' }}>
                Reviews
              </h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong style={{ fontSize: '0.8rem' }}>
                      {review.name}
                    </strong>
                    <Rating value={review.rating} />
                    <p style={{ fontSize: '0.8rem', margin: '0' }}>
                      {review.createdAt.substring(0, 10)}
                    </p>
                    <p style={{ fontSize: '0.8rem' }}>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h3 className="text-info" style={{ fontSize: '1.5rem' }}>
                    Write a Customer Review
                  </h3>
                  {successProductReview && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="rating">
                        <Form.Label className="text-success">Rating</Form.Label>
                        <Form.Control
                          size="sm"
                          as="select"
                          value={rating}
                          onChange={handleRatingChange}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="comment">
                        <Form.Label className="text-success">
                          Comment
                        </Form.Label>
                        <Form.Control
                          type="text"
                          size="sm"
                          value={comment}
                          onChange={handleCommentChange}
                          required
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        className="btn-info my-3"
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="login">Sign In</Link> to write a review{' '}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
