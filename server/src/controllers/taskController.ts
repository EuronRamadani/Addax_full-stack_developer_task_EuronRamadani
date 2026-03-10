import { Request, Response } from 'express';
import Task from '../models/Task';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month } = req.query;
    let filter: Record<string, unknown> = {};

    if (typeof month === 'string' && /^\d{4}-\d{2}$/.test(month)) {
      filter = { date: { $regex: `^${month}` } };
    }

    const tasks = await Task.find(filter).sort({ date: 1, order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date, color } = req.body as { title: string; date: string; color?: string };

    if (!title || !date) {
      res.status(400).json({ message: 'Title and date are required' });
      return;
    }

    const existing = await Task.find({ date }).sort({ order: -1 }).limit(1);
    const maxOrder = existing.length > 0 ? existing[0].order : -1;

    const task = new Task({
      title,
      date,
      order: maxOrder + 1,
      color: color ?? '#4A90E2',
    });

    const saved = await task.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, date, order, color } = req.body as {
      title?: string;
      date?: string;
      order?: number;
      color?: string;
    };

    const fields: Record<string, unknown> = {};
    if (title !== undefined) fields.title = title;
    if (date !== undefined) fields.date = date;
    if (order !== undefined) fields.order = order;
    if (color !== undefined) fields.color = color;

    const task = await Task.findByIdAndUpdate(id, fields, { new: true, runValidators: true });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error });
  }
};

export const reorderTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tasks } = req.body as { tasks: { _id: string; order: number; date: string }[] };

    if (!Array.isArray(tasks)) {
      res.status(400).json({ message: 'tasks must be an array' });
      return;
    }

    const updates = tasks.map(({ _id, order, date }) =>
      Task.findByIdAndUpdate(_id, { order, date }, { new: true })
    );

    await Promise.all(updates);
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reorder tasks', error });
  }
};
