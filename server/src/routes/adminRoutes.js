import express from 'express';
import {
  getAdminOverview,
  getAllUsers,
  getAllItemsAdmin,
  deleteInappropriateItem,
  getAllClaimsAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, requireAdmin);

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.get('/items', getAllItemsAdmin);
router.delete('/items/:id', deleteInappropriateItem);
router.get('/claims', getAllClaimsAdmin);

export default router;
