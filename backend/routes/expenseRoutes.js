import express from 'express';
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.post('/', authenticateJWT, addExpense);
router.get('/', authenticateJWT, getExpenses);
router.get('/:id', authenticateJWT, getExpenseById);
router.put('/:id', authenticateJWT, updateExpense);
router.delete('/:id', authenticateJWT, deleteExpense);

export default router;