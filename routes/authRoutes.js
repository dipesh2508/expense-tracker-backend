const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// @route    POST api/auth/signup
// @desc     Register user
// @access   Public
router.post('/signup', register);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post('/login', login);

module.exports = router;
