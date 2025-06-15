import express from 'express';
import { createHousehold, getHouseholds } from '../controllers/householdController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, createHousehold);
router.get('/', authenticateJWT, getHouseholds);

export default router;