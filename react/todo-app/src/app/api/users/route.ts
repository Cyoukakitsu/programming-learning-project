const users = [
  { id: 1, name: "sai", email: "saiprasad.sai@gmail.com" },
  { id: 2, name: "lei", email: "leiprasad.sai@gmail.com" },
  { id: 3, name: "wang", email: "wangprasad.sai@gmail.com" },
];

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return Response.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
  };
  users.push(newUser);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return Response.json(newUser);
}
