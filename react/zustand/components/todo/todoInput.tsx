"use client";

import { useTodoStore } from "@/store/todoStore";
import { useState } from "react";

const TodoInput = () => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [value, setValue] = useState("");

  return (
    <div className="mt-4  gap-4 flex">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add todo"
        className="border border-black rounded p-2 mr-2"
      />
      <button
        onClick={() => {
          if (!value) return;
          addTodo(value);
          setValue("");
        }}
      >
        Add
      </button>
    </div>
  );
};

export default TodoInput;
