const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// login&auth check
const protect = asyncHandler(async (req, res, next) => {
  if (!req.session.user || !req.session.isLoggedIn) {
    res.status(401);
    throw new Error('Not authorized!');
  }

  if (req.session && req.session.user && req.session.isLoggedIn) {
    try {
      req.user = await User.findById(req.session.user._id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized!');
    }
  }
});

// admin check
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized!');
  }
};

module.exports = { protect, admin };
