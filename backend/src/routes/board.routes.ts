import { Router } from 'express';
import {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  shareBoard,
} from '../controllers/board.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate); // Protect all board routes

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
router.post('/:id/share', shareBoard);

export default router;
