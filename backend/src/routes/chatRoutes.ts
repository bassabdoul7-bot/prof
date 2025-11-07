import express from 'express';
import { solveProblem, getConversations } from '../controllers/chatController.js';

const router = express.Router();

router.post('/solve', solveProblem);
router.get('/conversations/:userId', getConversations);

export default router;
