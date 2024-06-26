const Expense = require('../models/expense');

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

    try {
        const newExpense = new Expense({
            user: req.user.id,
            amount,
            category,
            date,
            description,
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateExpense = async (req, res) => {
    const { amount, category, date, description } = req.body;

    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { $set: { amount, category, date, description } },
            { new: true }
        );

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ msg: 'Expense not found' });
        }

        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Expense.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
