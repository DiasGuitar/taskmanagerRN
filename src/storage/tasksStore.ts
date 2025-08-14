import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/Task';

const KEY = 'TASKS_V1';

export async function getTasks(): Promise<Task[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Task[] : [];
}

async function setTasks(tasks: Task[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
}

export async function addTask(task: Task) {
  const tasks = await getTasks();
  tasks.push(task);
  await setTasks(tasks);
}

export async function updateTask(task: Task) {
  const tasks = await getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) {
    tasks[idx] = task;
    await setTasks(tasks);
  }
}

export async function deleteTask(id: string) {
  const tasks = await getTasks();
  await setTasks(tasks.filter(t => t.id !== id));
}

export async function setStatus(id: string, status: Task['status']) {
  const tasks = await getTasks();
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.status = status;
    t.updatedAt = Date.now();
    await setTasks(tasks);
  }
}