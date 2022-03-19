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
  csrf = require('csurf'),
  MongoDBStore = require('connect-mongodb-session')(session),
  errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: 1000 * 60 * 60 * 24 * 7, // (7 = 7 days = 1 week)
  // cookie: {}, // we can define cookie, middleware automatically set cookies
});
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a', interval: '1d' } // a = append
);

const csrfProtection = csrf();

/************************ MIDDLEWARE ******************************/
app.use(express.json());

app.use(
  session({
    secret: '*29.who7!!/<)wanT3tO0be!aMi)lli!on@rE5,',
    resave: false, // just save when session change
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection); // it must define after session

app.use(helmet()); // PROD purpose

if (MODE === 'DEV') {
  app.use(morgan('dev'));
} else if (MODE === 'PROD') {
  app.use(morgan('combined', { stream: accessLogStream }));
}

/************************ ROUTES MIDDLEWARE ************************/
app.get('/getCSRFToken', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_API)
);

app.use('/uploads', express.static(path.join(dirname, '/uploads')));
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (MODE === 'PROD') {
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

/************************ SERVER **********************************/
app.listen(
  PORT,
  console.log(`Server running in ${MODE} mode on port ${PORT}`.yellow.bold)
);
