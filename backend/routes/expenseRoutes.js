import express from 'express';
import upload from '../utils/upload.js';
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// With receipt upload & ML integration
router.post(
  "/upload",
  authenticateJWT,
  upload.single("receipt"),
  addExpense // controller will handle ML
);

router.post('/', authenticateJWT, addExpense);
router.get('/', authenticateJWT, getExpenses);
router.get('/:id', authenticateJWT, getExpenseById);
router.put('/:id', authenticateJWT, updateExpense);
router.delete('/:id', authenticateJWT, deleteExpense);

export default router;