import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import * as api from '../api/tasks';

export const useTasks = (month: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchTasks(month);
      setTasks(data);
    } catch {
      // no-op
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const tasksMap: Record<string, Task[]> = {};
  for (const task of tasks) {
    if (!tasksMap[task.date]) tasksMap[task.date] = [];
    tasksMap[task.date].push(task);
  }
  for (const date in tasksMap) {
    tasksMap[date].sort((a, b) => a.order - b.order);
  }

  const createTask = useCallback(
    async (data: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
      const created = await api.createTask(data);
      setTasks((prev) => [...prev, created]);
    },
    []
  );

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    const updated = await api.updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  }, []);

  const reorderTasks = useCallback(
    async (updates: { _id: string; order: number; date: string }[]) => {
      await api.reorderTasks(updates);
      setTasks((prev) =>
        prev.map((t) => {
          const update = updates.find((u) => u._id === t._id);
          return update ? { ...t, order: update.order, date: update.date } : t;
        })
      );
    },
    []
  );

  return { tasks, tasksMap, loading, createTask, updateTask, deleteTask, reorderTasks };
};
