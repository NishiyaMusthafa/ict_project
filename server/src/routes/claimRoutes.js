import express from 'express';
import {
  submitClaim,
  getMyClaims,
  getItemClaims,
  decideClaim
} from '../controllers/claimController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, submitClaim);
router.get('/my-claims', protect, getMyClaims);
router.get('/item/:itemId', protect, getItemClaims);
router.put('/:id/decision', protect, decideClaim);

export default router;
