import { useTodoStore } from "@/store/todoStore";

const TodoFilter = () => {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  return <div>TodoFilter</div>;
};

export default TodoFilter;
