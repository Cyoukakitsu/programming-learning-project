// 数据查询的“全局管理器”，为整个应用提供统一的数据获取、缓存和状态管理能力

"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  
  //用 useState 创建并保存一个 QueryClient 实例，且只创建一次。
  //useState 的初始化函数只执行一次，避免每次渲染都创建新实例。
  const [client] = useState(() => new QueryClient());

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
