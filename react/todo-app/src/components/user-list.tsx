"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchUsers() {
  const response = await fetch("/api/users");
  return response.json();
}

const UsersList = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  console.log(data);
  return <div>UserList</div>;
};

export default UsersList;
