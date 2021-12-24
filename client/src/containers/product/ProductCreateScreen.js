import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Message from "../../components/main/Message";
import Loader from "../../components/main/Loader";
import FormContainer from "../../components/main/FormContainer";
import { createProduct } from "../../redux/actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../redux/constants/productConstants";

const ProductCreateScreen = () => {
  // Redux
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  // State
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  // Route
  let navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/");
    } else {
      if (success) {
        dispatch({ type: PRODUCT_CREATE_RESET });
        navigate("/admin/productlist");
      }
    }
  }, [dispatch, navigate, success, userInfo]);

  // Methods
  const handleUploadFile = async (e) => {
    const file = e.target.files[0]; // it can be multiple, take first element in array
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      // File path returns from backend
      const { data } = await axios.post("/api/upload", formData, config);

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
      createProduct({
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
    e.preventDefault();
    setName(e.target.value);
  };

  const handlePriceChange = (e) => {
    e.preventDefault();
    setPrice(e.target.value);
  };

  const handleBrandChange = (e) => {
    e.preventDefault();
    setBrand(e.target.value);
  };

  const handleStockChange = (e) => {
    e.preventDefault();
    setCountInStock(e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setCategory(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    e.preventDefault();
    setDescription(e.target.value);
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-outline-info my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1 style={{ fontSize: "2.5rem" }} className='text-info'>
          Create Product
        </h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}

        {uploading && <Loader />}
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              size='sm'
              placeholder='Enter name'
              value={name}
              onChange={handleNameChange}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='price'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              size='sm'
              placeholder='Enter price'
              value={price}
              onChange={handlePriceChange}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              size='sm'
              className='bg-info btn-light'
              type='file'
              onChange={handleUploadFile}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Select size='sm' onChange={handleBrandChange}>
              <option>Select Brand</option>
              <option value='Pioneer DJ'>Pioneer DJ</option>
              <option value='Denon DJ'>Denon DJ</option>
              <option value='Numark'>Numark</option>
              <option value='Allen & Heath'>Allen & Heath</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3' controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='number'
              size='sm'
              placeholder='Enter countInStock'
              value={countInStock}
              onChange={handleStockChange}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Select size='sm' onChange={handleCategoryChange}>
              <option>Select Category</option>
              <option value='DJ Player'>DJ Player</option>
              <option value='DJ Mixer'>DJ Mixer</option>
              <option value='DJ Controller'>DJ Controller</option>
              <option value='Turntable'>Turntable</option>
              <option value='All In One'>All In One</option>
              <option value='Headphone'>Headphone</option>
              <option value='Software'>Software</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className='mb-3' controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
              size='sm'
              placeholder='Enter description'
              value={description}
              onChange={handleDescriptionChange}
              required
              as='textarea'
              rows={2}
            ></Form.Control>
          </Form.Group>

          <Button
            type='submit'
            variant='primary'
            className='btn btn-info'
            size='sm'
          >
            Create
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
