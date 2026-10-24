import express from 'express';
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getPlatformStats
} from '../controllers/itemController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats/summary', getPlatformStats);
router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(optionalAuth, getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;
