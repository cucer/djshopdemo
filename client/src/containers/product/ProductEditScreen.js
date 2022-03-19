import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import Message from '../../components/main/Message';
import Loader from '../../components/main/Loader';
import FormContainer from '../../components/main/FormContainer';
import {
  listProductDetails,
  updateProduct,
} from '../../redux/actions/productActions';
import { PRODUCT_UPDATE_RESET } from '../../redux/constants/productConstants';
import {
  deleteCSRFToken,
  getCSRFTokenPOST,
} from '../../common/commonFunctions';

const ProductEditScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  // State
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Route
  let navigate = useNavigate();
  let params = useParams();
  const productId = params.id;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    } else {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET });
        navigate('/admin/productlist');
      } else {
        if (!product.name || product._id !== productId) {
          dispatch(listProductDetails(productId));
        } else {
          setName(product.name);
          setPrice(product.price);
          setImage(product.image);
          setBrand(product.brand);
          setCategory(product.category);
          setCountInStock(product.countInStock);
          setDescription(product.description);
        }
      }
    }
  }, [dispatch, navigate, userInfo, product, productId, successUpdate]);

  // Methods
  const handleUploadFile = async (e) => {
    const file = e.target.files[0]; // it can be multiple, take first element in array
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Route & Method & CSRF
      await getCSRFTokenPOST();
      const { data } = await axios.post('/api/upload', formData, config);
      deleteCSRFToken();

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handleStockChange = (e) => {
    setCountInStock(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-outline-info my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1 style={{ fontSize: '2.5rem' }} className="text-info">
          Edit Product
        </h1>
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loadingUpdate && <Loader />}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                size="sm"
                placeholder="Enter name"
                value={name}
                onChange={handleNameChange}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                placeholder="Enter price"
                value={price}
                onChange={handlePriceChange}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                size="sm"
                className="bg-info btn-light"
                type="file"
                onChange={handleUploadFile}
                required
              />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Select size="sm" onChange={handleBrandChange} value={brand}>
                <option>Select Brand</option>
                <option value="Pioneer DJ">Pioneer DJ</option>
                <option value="Denon DJ">Denon DJ</option>
                <option value="Numark">Numark</option>
                <option value="Allen & Heath">Allen & Heath</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                size="sm"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={handleStockChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                size="sm"
                onChange={handleCategoryChange}
                value={category}
              >
                <option>Select Category</option>
                <option value="DJ Player">DJ Player</option>
                <option value="DJ Mixer">DJ Mixer</option>
                <option value="DJ Controller">DJ Controller</option>
                <option value="Turntable">Turntable</option>
                <option value="All In One">All In One</option>
                <option value="Headphone">Headphone</option>
                <option value="Software">Software</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter description"
                value={description}
                onChange={handleDescriptionChange}
                as="textarea"
                rows={2}
                required
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="btn btn-info"
              size="sm"
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
