const mongoose = require('mongoose');
const Expense = require('../../../models/expense');

describe('Expense Model Unit Tests', () => {
  let validExpenseData;

  beforeEach(() => {
    validExpenseData = {
      user: new mongoose.Types.ObjectId(),
      amount: 100,
      category: new mongoose.Types.ObjectId(),
      description: 'Groceries',
      date: new Date()
    };
  });

  it('should create expense with valid data', async () => {
    const expense = new Expense(validExpenseData);
    const savedExpense = await expense.save();
    
    expect(savedExpense.amount).toBe(validExpenseData.amount);
    expect(savedExpense.category.toString()).toBe(validExpenseData.category.toString());
    expect(savedExpense.description).toBe(validExpenseData.description);
  });

  it('should fail without user', async () => {
    const invalidData = { ...validExpenseData };
    delete invalidData.user;
    const expense = new Expense(invalidData);
    
    try {
      await expense.save();
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.user).toBeDefined();
    }
  });

  it('should fail without amount', async () => {
    const invalidData = { ...validExpenseData };
    delete invalidData.amount;
    const expense = new Expense(invalidData);
    
    try {
      await expense.save();
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.amount).toBeDefined();
    }
  });

  it('should fail without category', async () => {
    const invalidData = { ...validExpenseData };
    delete invalidData.category;
    const expense = new Expense(invalidData);
    
    try {
      await expense.save();
      fail('Should have thrown validation error');
    } catch (error) {
      expect(error.name).toBe('ValidationError');
      expect(error.errors.category).toBeDefined();
    }
  });

  it('should set default date if not provided', async () => {
    const expenseWithoutDate = {
      user: validExpenseData.user,
      amount: validExpenseData.amount,
      category: validExpenseData.category,
      description: validExpenseData.description
    };
    
    const expense = new Expense(expenseWithoutDate);
    const savedExpense = await expense.save();
    
    expect(savedExpense.date).toBeDefined();
    expect(savedExpense.date instanceof Date).toBeTruthy();
  });
});