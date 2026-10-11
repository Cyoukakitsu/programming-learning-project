//这是 Next.js 的 API 路由文件，用于处理 /api/auth 的请求，代理 BetterAuth 的认证请求。
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);
