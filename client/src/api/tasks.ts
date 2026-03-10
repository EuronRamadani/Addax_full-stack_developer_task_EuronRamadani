import axios from 'axios';
import { Task } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

export const fetchTasks = async (month: string): Promise<Task[]> => {
  const { data } = await api.get<Task[]>('/tasks', { params: { month } });
  return data;
};

export const createTask = async (
  data: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Task> => {
  const { data: task } = await api.post<Task>('/tasks', data);
  return task;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const { data: task } = await api.put<Task>(`/tasks/${id}`, data);
  return task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const reorderTasks = async (
  tasks: { _id: string; order: number; date: string }[]
): Promise<void> => {
  await api.put('/tasks/reorder', { tasks });
};
