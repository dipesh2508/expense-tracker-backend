const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

// @route    GET api/expenses
// @desc     Get all expenses
// @access   Private
router.get('/', authMiddleware, getExpenses);

// @route    POST api/expenses
// @desc     Add new expense
// @access   Private
router.post('/', authMiddleware, addExpense);

// @route    PUT api/expenses/:id
// @desc     Update expense
// @access   Private
router.put('/:id', authMiddleware, updateExpense);

// @route    DELETE api/expenses/:id
// @desc     Delete expense
// @access   Private
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;
