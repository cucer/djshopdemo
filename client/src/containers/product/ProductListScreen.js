import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Container } from "react-bootstrap";
import Message from "../../components/main/Message";
import Loader from "../../components/main/Loader";
import Paginate from "../../components/main/Paginate";
import {
  listProducts,
  deleteProduct,
} from "../../redux/actions/productActions";

const ProductListScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;
  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  // Route
  let navigate = useNavigate();
  let params = useParams();
  const pageNumber = params.pageNumber || 1;

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else {
      dispatch(listProducts("", pageNumber)); // first parameter "" for keyword but it is not necessary in admin page, second one is for pagination
    }
  }, [dispatch, navigate, userInfo, pageNumber, successDelete]);

  // Methods
  const handleProductCrete = () => {
    navigate("/admin/product/create");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <Container>
        <Row className='align-items-center'>
          <Col sm={9}>
            <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
              Products
            </h1>
          </Col>
          <Col sm={3} className='text-right'>
            <Button
              className='my-3 btn-info'
              size='sm'
              onClick={handleProductCrete}
            >
              <i className='fas fa-plus'></i> Create Product
            </Button>
          </Col>
        </Row>
      </Container>
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingDelete && <Loader />}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr className='text-primary'>
                {/* <th>ID</th> */}
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className='table-secondary'>
                  {/* <td>{product._id}</td> */}
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => handleDelete(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
