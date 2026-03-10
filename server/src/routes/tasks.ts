import { Router } from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../controllers/taskController';

const router = Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/reorder', reorderTasks); // Must come BEFORE /:id
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
