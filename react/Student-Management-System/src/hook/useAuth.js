import { getUser } from "../services/APIAuth";

export async function isAuthenticated() {
  const user = await getUser();

  if (!user) {
    return false;
  }

  return true;
}
