import {
  createAgentSession,
  DefaultResourceLoader, // 资源加载器：管提示词、技能、扩展等资源的加载
  getAgentDir, // 返回全局配置目录 ~/.pi/agent
  ModelRuntime,
  SessionManager, // 会话管理器：管对话历史的存取
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const model = (await modelRuntime.getAvailable())[0];
if (!model) throw new Error("没有可用模型，请检查 ~/.pi/agent/models.json");

const loader = new DefaultResourceLoader({
  cwd: process.cwd(), // 当前工作目录
  agentDir: getAgentDir(), // 全局配置目录
  // ★ 换基础人设：返回什么，人设就是什么（忽略 base，彻底替换）
  systemPromptOverride: () => `你是一个企业数据分析助手，帮业务方分析销售数据、定位问题、给出建议。
回答前先确认已知信息和未知信息，不要编造数据。`,
  // ★ 清空追加规则（②），剔除 .pi/APPEND_SYSTEM.md 文件的内容（如果有的话）
  appendSystemPromptOverride: () => [],
});
await loader.reload(); // 重新加载资源（让上面的覆盖生效）

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader, // ★ 把自定义 Loader 传进去
  sessionManager: SessionManager.inMemory(), // 用内存会话，调试不污染目录
});

try {
  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  console.log("💬 问：上月销售额下降了 15%，可能的原因有哪些？\n");
  await session.prompt("上月销售额下降了 15%，可能的原因有哪些？");
  console.log("\n");
} finally {
  session.dispose();
}
