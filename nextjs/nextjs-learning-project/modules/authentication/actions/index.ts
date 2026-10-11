//服务器端动作函数，用于获取当前登录用户的信息，包含身份验证和数据库查询。

//为什么需要 "use server"？
//安全：数据库连接和密钥不能暴露到浏览器。
//性能：服务器端查询更快，减少客户端负担。
//权限：服务器端可以访问环境变量和数据库。
"use server";

import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const currentUser = async () => {
  try {
    //获取会话（auth.api.getSession）：检查是否登录。
    const session = await auth.api.getSession({
      //获取 HTTP 请求头，用于身份验证
      headers: await headers(),
    });

    //如果用户未登录，返回 null。
    if (!session?.user?.id) return null;

    //查询数据库（db.user.findUnique）：根据用户 ID 获取用户信息。
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },

      //为什么用 select？
      //性能：只查询需要的字段，减少数据传输。
      //安全：避免返回敏感信息（如密码）。
      //清晰：明确需要哪些数据。
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.log("Error getting current user", error);
    return null;
  }
};
