//这是一个自定义 React Hook，用于获取可用的 AI 模型列表，封装了 React Query 的查询逻辑。


import { useQuery } from "@tanstack/react-query";

export const useAIModels = () => {

  //useQuery 是 TanStack Query 库提供的核心 Hook，专门用于处理服务端数据请求。
  return useQuery({
    
    //queryKey 是查询的唯一标识，用于缓存和重用查询结果。
    queryKey: ["ai-models"],

    //queryFn 必须返回一个 Promise（异步函数），负责实际的接口请求。
    queryFn: () => fetch("/api/ai/get-models").then((res) => res.json()),
  });
};
