import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/main/Product';
import Message from '../components/main/Message';
import Loader from '../components/main/Loader';
import Paginate from '../components/main/Paginate';
import Meta from '../components/main/Meta';
import ProductCarousel from '../components/main/ProductCarousel';
import { listProducts } from '../redux/actions/productActions';

const HomeScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  // Route
  let navigate = useNavigate();
  let params = useParams();

  const keyword = params.keyword;
  const pageNumber = params.pageNumber || 1;

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    } else {
      dispatch(listProducts(keyword, pageNumber));
    }
  }, [dispatch, navigate, userInfo, keyword, pageNumber]);

  return (
    <>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-outline-info my-3">
          Go Back
        </Link>
      )}
      {!keyword && (
        <h2 style={{ fontSize: '2rem' }} className="text-info mt-4">
          Latest Products
        </h2>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
