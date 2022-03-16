// Only common JS
const express = require('express'),
  dotenv = require('dotenv'),
  connectDB = require('./config/db'),
  colors = require('colors'),
  morgan = require('morgan'),
  path = require('path'),
  userRoutes = require('./routes/userRoutes'),
  productRoutes = require('./routes/productRoutes'),
  uploadRoutes = require('./routes/uploadRoutes'),
  orderRoutes = require('./routes/orderRoutes'),
  errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'DEV') {
  app.use(morgan('dev'));
}

// These paths come from redux actions
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_API)
);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === 'PROD') {
  app.use(express.static(path.join(dirname, '/client/build')));
  // app.use(express.static(path.join(__dirname, "/client/build")));

  app.get(
    '*',
    (req, res) =>
      res.sendFile(path.resolve(dirname, 'client', 'build', 'index.html'))
    // res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get('/', (req, res) => {
    res.send('Server is running....');
  });
}

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

app.listen(
  PORT,
  console.log(`Server running in ${MODE} mode on port ${PORT}`.yellow.bold)
);
