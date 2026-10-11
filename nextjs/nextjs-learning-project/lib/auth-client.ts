//客户端认证实例，用于客户端验证和数据库操作。

import { createAuthClient } from "better-auth/react";
export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: "http://localhost:3001",
});
