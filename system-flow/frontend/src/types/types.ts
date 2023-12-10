export type Task = {
  id: number;
  name: string;
  due: string;
  completed: boolean;
  subtasks: Task[];
};