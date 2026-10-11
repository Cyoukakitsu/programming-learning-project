import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
};

export type FilterType = "all" | "active" | "completed";

type TodoState = {
  todos: Todo[];
  filter: FilterType;
  isLoading: boolean;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updatedData: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setLoading: (isLoading: boolean) => void;
  filteredTodos: () => Todo[];
  completedCount: () => number;
  activeCount: () => number;
};

export const useTodoStore = create<TodoState>()(
  devtools(
    (set, get) => ({
      todos: [],
      filter: "all",
      isLoading: false,

      setTodos: (todos) => set({ todos }),

      addTodo: (todo) =>
        set((state) => ({
          todos: [...state.todos, todo],
        })),

      updateTodo: (id, updatedData) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo._id === id ? { ...todo, ...updatedData } : todo,
          ),
        })),

      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo._id !== id),
        })),

      setFilter: (filter) => set({ filter }),

      setLoading: (isLoading) => set({ isLoading }),

      filteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case "active":
            return todos.filter((todo) => !todo.completed);
          case "completed":
            return todos.filter((todo) => todo.completed);
          default:
            return todos;
        }
      },

      completedCount: () => get().todos.filter((todo) => todo.completed).length,

      activeCount: () => get().todos.filter((todo) => !todo.completed).length,
    }),
    {
      name: "todo-store",
    },
  ),
);
