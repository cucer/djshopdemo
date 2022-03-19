const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const stack = process.env.NODE_ENV === 'PROD' ? null : err.stack; // only dev enviroment
  const message =
    err.code === 'EBADCSRFTOKEN' ? 'Not authorized!' : err.message; // don't send specific csrf message

  res.status(statusCode);
  res.json({
    message: message,
    stack,
  });
};

module.exports = { notFound, errorHandler };
