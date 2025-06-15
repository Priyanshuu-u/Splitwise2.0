import Expense from '../models/Expense.js';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';

export const addExpense = async (req, res) => {
  try {
    let { description, amount, category, paidBy, household, involved } = req.body;
    let receiptUrl = req.file ? req.file.path : undefined;
    let aiData = {};

    if (req.file) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(req.file.path));
      const mlRes = await axios.post("http://localhost:8000/ocr", formData, {
        headers: formData.getHeaders(),
      });
      aiData = mlRes.data;
      description = aiData.ocr?.description || description;
      amount = aiData.ocr?.amount || amount;
      category = aiData.classification || category;
    }

    const expense = await Expense.create({
      description,
      amount,
      category,
      paidBy: paidBy || req.user.id,
      household,
      involved: involved || [req.user.id],
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