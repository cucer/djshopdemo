// Only common JS
const express = require('express'),
  dotenv = require('dotenv'),
  connectDB = require('./config/db'),
  colors = require('colors'),
  morgan = require('morgan'),
  path = require('path'),
  fs = require('fs'),
  userRoutes = require('./routes/userRoutes'),
  productRoutes = require('./routes/productRoutes'),
  uploadRoutes = require('./routes/uploadRoutes'),
  orderRoutes = require('./routes/orderRoutes'),
  session = require('express-session'),
  helmet = require('helmet'),
  MongoDBStore = require('connect-mongodb-session')(session),
  errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

connectDB();

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 7, // (7 = 7 days = 1 week)
  // cookie: {}, // we can define cookie, middleware automatically set cookies
});

app.use(express.json());

// if (process.env.NODE_ENV === 'DEV') {
//   app.use(morgan('dev'));
// }

app.use(
  session({
    secret: '*29.who7!!/<)wanT3tO0be!aMi)lli!on@rE5,',
    resave: false, // just save when session change
    saveUninitialized: false,
    store: store,
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_API)
);

//PROD login log
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a', interval: '1d' } // a = append
);

app.use(helmet()); // PROD
app.use(morgan('combined', { stream: accessLogStream })); // PROD

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
