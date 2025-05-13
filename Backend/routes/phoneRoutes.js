import express from 'express';
import { getPhoneSeller, getPhoneById } from '../controllers/phoneController.js';

const router = express.Router();

// GET /api/phones → Get all phones
router.get('/', getPhoneSeller);

// GET /api/phones/:id → Get a single phone by ID
router.get('/:id', getPhoneById);

export default router;
