//这是主题提供者组件，用于在应用内切换深色/浅色模式。

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

//对第三方库组件的封装，统一管理主题配置
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
