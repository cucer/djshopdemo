const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // Options
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
