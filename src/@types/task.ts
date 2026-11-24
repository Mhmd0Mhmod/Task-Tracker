interface Task {
  id: number;
  task: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

export default Task;
