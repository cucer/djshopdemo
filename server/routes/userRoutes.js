const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// "/api/users"
router.route('/').get(auth.protect, auth.admin, userController.getUsers);

// "/api/users/register"
router.post('/register', userController.registerUser);

// "/api/users/login"
router.post('/login', userController.loginUser);

// "/api/users/logout"
router.post('/logout', userController.logoutUser);

// "api/users/profile"
router
  .route('/profile')
  .get(auth.protect, userController.getUserProfile)
  .put(auth.protect, userController.updateUserProfile);

// "/api/users/:id"  // :id route must be end of the line
router
  .route('/:id')
  .delete(auth.protect, auth.admin, userController.deleteUser)
  .get(auth.protect, auth.admin, userController.getUserById)
  .put(auth.protect, auth.admin, userController.updateUser);

module.exports = router;
