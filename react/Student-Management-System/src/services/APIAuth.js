import { supabase } from "../utils/supabase";

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: `${email}-${Date.now()}`,
        avatar:
          "https://i.pinimg.com/originals/78/7b/b1/787bb10ef4f399952cf290d649a0d1bd.jpg",
      },
    },
  });

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}

export async function signout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error.message);
  }
}

export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function updateUser(newUserMetadata = {}) {
  const { data, error } = await supabase.auth.updateUser({
    data: newUserMetadata,
  });

  if (error) {
    console.log(error.message);
    return;
  }
  return data;
}
