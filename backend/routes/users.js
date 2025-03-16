const express = require('express');
// Router middleware in express
const router = express.Router();
const usersController = require('../controller/users');

router.post('/register', usersController.handleSignUp);
router.post('/login', usersController.handleLogin);
//router.post('/saveCart', usersController);
router.get('/isUserAvailable/:name', usersController.IsUsernameAvailable);

module.exports = router;