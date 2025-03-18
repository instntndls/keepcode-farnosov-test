import { defineStore } from 'pinia'

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]')
  }),

  actions: {
    saveTasksToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },

    // Получение списка задач
    async fetchTasks() {
      if (this.tasks.length === 0) {
        try {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
          if (!response.ok) throw new Error('Ошибка загрузки задач');

          const data: Task[] = await response.json();
          this.tasks = data;
          this.saveTasksToLocalStorage();
        } catch (error) {
          console.error('Ошибка загрузки:', error);
        }
      }
    },

    // Добавление новой задачи
    async addTask(title: string) {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, completed: false })
        });

        if (!response.ok) throw new Error('Ошибка при добавлении задачи');

        const newTask: Task = await response.json();
        newTask.id = Date.now();
        this.tasks.push(newTask);
        this.saveTasksToLocalStorage();
      } catch (error) {
        console.error('Ошибка при добавлении:', error);
      }
    },

    // Редактирование задачи
    async editTask(taskId: number, newTitle: string) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.title = newTitle;
        this.saveTasksToLocalStorage();
      }
    },

    // Удаление задачи
    async deleteTask(taskId: number) {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      this.saveTasksToLocalStorage();
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Ошибка при удалении задачи');
      } catch (error) {
        console.error('Ошибка удаления задачи:', error);
      }
    },

    // Завершение задачи
    async completeTask(taskId: number) {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = true;
        this.saveTasksToLocalStorage();
      }
    }
  }
});
