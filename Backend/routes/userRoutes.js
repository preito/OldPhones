import express from 'express';
import { getUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users → Get all users
router.get('/', getUsers);

// GET /api/users/:id → Get a single user by ID
router.get('/:id', getUserById);

export default router;
