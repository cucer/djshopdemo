// Only common JS
const express = require('express'),
  toobusy = require('node-toobusy'),
  dotenv = require('dotenv'),
  connectDB = require('./config/db'),
  colors = require('colors'),
  morgan = require('morgan'),
  path = require('path'),
  fs = require('fs'),
  cookieParser = require('cookie-parser'),
  userRoutes = require('./routes/userRoutes'),
  productRoutes = require('./routes/productRoutes'),
  uploadRoutes = require('./routes/uploadRoutes'),
  orderRoutes = require('./routes/orderRoutes'),
  session = require('express-session'),
  helmet = require('helmet'),
  csrf = require('csurf'),
  hpp = require('hpp'),
  MongoDBStore = require('connect-mongodb-session')(session),
  errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const dirname = path.resolve();
const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;
const week = 1000 * 60 * 60 * 24 * 7; // (7 = 7 days = 1 week)
const hour = 3600000;
const minute = 60000;
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  expires: new Date(Date.now() + hour),
  // cookie: {}, // we can define cookie, middleware automatically set cookies
});
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a', interval: '1d' } // a = append
);

const csrfProtection = csrf();

/************************ MIDDLEWARE ******************************/
app.use(express.json());

// middleware which blocks requests when we're too busy // DoS attack
app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

app.use(cookieParser());

app.use(
  session({
    secret: '*29.who7!!/<)wanT3tO0be!aMi)lli!on@rE5,',
    resave: false, // just save when session change
    saveUninitialized: false,
    store: store,
    cookie: {
      // httpOnly: true, // default true
      // secure: true,
      maxAge: hour, // when maxAge has passed, browser will be loggedout both client end server
    },
  })
);

app.use(csrfProtection); // it must define after session

app.use(hpp()); // HTTP Parameter Pollution

app.use(helmet()); // this default line is equal to 15 smaller middlewares below
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.crossOriginEmbedderPolicy());
// app.use(helmet.crossOriginOpenerPolicy());
// app.use(helmet.crossOriginResourcePolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.originAgentCluster());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());

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
