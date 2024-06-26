const express = require('express');
const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// @route    GET api/categories
// @desc     Get all categories
// @access   Private
router.get('/', authMiddleware, getCategories);

// @route    POST api/categories
// @desc     Add new category
// @access   Private
router.post('/', authMiddleware, addCategory);

// @route    PUT api/categories/:id
// @desc     Update category
// @access   Private
router.put('/:id', authMiddleware, updateCategory);

// @route    DELETE api/categories/:id
// @desc     Delete category
// @access   Private
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
