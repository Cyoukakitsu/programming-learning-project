"use client";

import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type UserInput = {
  name: string;
  email: string;
};
const AddUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const queryClient = useQueryClient();

  async function addUser(userData: UserInput) {
    const response = await fetch("api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  }

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && email) {
      mutation.mutate({ name, email });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;