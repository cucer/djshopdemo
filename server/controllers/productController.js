const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

/************************* /api/products **************************/
// @desc   Create product
// @route  POST /api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    user: req.user._id,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    numReviews: 0,
    description: req.body.description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Fetch all products
// @route  GET /api/products
// @access Private
const getHomeProducts = asyncHandler(async (req, res) => {
  const pageSize = 12; // pagination(divider)
  // for example: if we have only 6 products and pageSize = 10 >>> pagination will not appear
  // for example: if we have 20 products and pageSize = 10 >>> pagination will show 2 pages
  const page = Number(req.query.pageNumber) || 1; // current page

  // keyword comes from search box in header
  const keyword = req.query.keyword
    ? {
        name: {
          // regular express - when you type anything then it will appear. type "iph" and iphone comes
          $regex: req.query.keyword,
          $options: 'i', // case insensitive
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword }); // how many product?

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch all products
// @route  GET /api/products
// @access Private/Admin
// It must be like getHomeProducts
const getAdminProducts = asyncHandler(async (req, res) => {
  const pageSize = 12; // pagination(divider)
  // for example: if we have only 6 products and pageSize = 10 >>> pagination will not appear
  // for example: if we have 20 products and pageSize = 10 >>> pagination will show 2 pages
  const page = Number(req.query.pageNumber) || 1; // current page

  const count = await Product.countDocuments({}); // how many product?

  const products = await Product.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

/************************* /api/products/:id **************************/
// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Private
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    // these errors will be shown by errorHandler middleware, we have middleware for errors
    throw new Error('Product not found');
  }
});

// @desc   Update product
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/************************* /api/products/:id/reviews **************************/
// @desc   Create new review
// @route  POST /api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

/************************* /api/products/:id/top **************************/
// @desc   Get top rated products
// @route  GET /api/products/:id/top
// @access Private
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

module.exports = {
  createProduct,
  getHomeProducts,
  getAdminProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  createProductReview,
  getTopProducts,
};
