//这是 Next.js 的 API 路由文件，用于处理 /api/ai/get-models 的 GET 请求，从 OpenRouter API 获取 AI 模型列表，筛选免费模型并格式化返回。

import { NextResponse } from "next/server";

type OpenRouterModel = {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
};

export async function GET() {
  try {

    //使用 fetch 调用外部 API，通过 Authorization 头传递 API 密钥进行认证。
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      
      method: "GET",
      headers: {

        //从环境变量读取 API 密钥
        //安全性：API 密钥不会暴露在代码中
        //灵活性：不同环境可以使用不同的密钥
        //版本控制：.env 文件通常不提交到 Git。
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    //先筛选出免费模型（价格为 0），然后格式化数据，只返回需要的字段。
    const freeModels = data.data.filter((model: OpenRouterModel) => {
      const promptPrice = parseFloat(model.pricing?.prompt || "0");
      const completionPrice = parseFloat(model.pricing?.completion || "0");
      return promptPrice === 0 && completionPrice === 0;
    });

    const formattedModels = freeModels.map((model: OpenRouterModel) => {
      return {
        id: model.id,
        name: model.name,
        description: model.description,
        context_length: model.context_length,
        architecture: model.architecture,
        pricing: model.pricing,
        top_provider: model.top_provider,
      };
    });

    return NextResponse.json({ models: formattedModels });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch models",
      },
      { status: 500 },
    );
  }
}
