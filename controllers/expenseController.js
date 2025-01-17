const Expense = require('../models/expense');
const Category = require('../models/category');

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.addExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    // Validate required fields
    if (!amount) {
        return res.status(400).json({ msg: 'Amount is required' });
    }

    if (!category) {
        return res.status(400).json({ msg: 'Category is required' });
    }

    try {
        // Validate category exists and belongs to user
        const categoryDoc = await Category.findOne({ 
            _id: category, 
            user: req.user.id 
        });
        
        if (!categoryDoc) {
            return res.status(400).json({ msg: 'Invalid category' });
        }

        const newExpense = new Expense({
            user: req.user.id,
            amount,
            category,
            date: date || new Date(),
            description
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Amount is required' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    if (!amount) {
        return res.status(400).json({ msg: 'Amount is required' });
    }

    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Validate category if provided
        if (category) {
            const categoryDoc = await Category.findOne({ 
                _id: category, 
                user: req.user.id 
            });
            
            if (!categoryDoc) {
                return res.status(400).json({ msg: 'Invalid category' });
            }
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: { amount, category, date, description } },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Expense.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
