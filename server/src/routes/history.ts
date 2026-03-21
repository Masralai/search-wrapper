import express, { Router } from 'express';
import {
  getSearchHistory,
  deleteSearchHistory,
  clearAllHistory,
} from '../controllers/historyController';

const router: Router = express.Router();

router.get('/history', getSearchHistory);
router.delete('/history/:id', deleteSearchHistory);
router.delete('/history', clearAllHistory);

export default router;
