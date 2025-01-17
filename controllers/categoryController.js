const Category = require('../models/category');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.addCategory = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ msg: 'Name is required' });
    }

    try {
        const newCategory = new Category({
            user: req.user.id,
            name: name.trim()
        });

        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: 'Name is required' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
    const { name } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ msg: 'Name is required' });
    }

    try {
        let category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        category = await Category.findByIdAndUpdate(
            req.params.id,
            { name: name.trim() },
            { new: true }
        );

        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Category.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
