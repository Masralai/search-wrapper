import express, { Router } from 'express';
import { performSearch } from '../controllers/searchController';

const router: Router = express.Router();

// Fix: This will handle POST /api/search when mounted at /api
router.post('/search', performSearch);

export default router;
