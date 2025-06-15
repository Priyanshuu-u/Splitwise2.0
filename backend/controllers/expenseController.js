import Expense from '../models/Expense.js';
import Household from '../models/Household.js';

export const addExpense = async (req, res) => {
  try {
    const { description, amount, category, paidBy, household, involved, receiptUrl, aiData } = req.body;
    // Optionally: Validate that household and involved users exist
    const expense = await Expense.create({
      description,
      amount,
      category,
      paidBy,
      household,
      involved,
      receiptUrl,
      aiData
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { household } = req.query;
    const filter = household ? { household } : {};
    const expenses = await Expense.find(filter).populate('paidBy involved household');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id).populate('paidBy involved household');
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Expense not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};