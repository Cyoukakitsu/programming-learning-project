import { readFile } from "node:fs/promises";
import {
  createAgentSession,
  DefaultResourceLoader,
  getAgentDir,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const model = (await modelRuntime.getAvailable())[0];
if (!model) throw new Error("没有可用模型，请检查 ~/.pi/agent/models.json");

// 1. 静态层：文件，非开发者也能改
const [persona, rules, format] = await Promise.all(
  ["persona", "rules", "output-format"].map((n) =>
    readFile(new URL(`./prompts/analyst/${n}.md`, import.meta.url), "utf8"),
  ),
);

// 2. 动态层：模拟按 userId 查库
const getUser = async (userId: string) => ({
  name: "张三",
  department: "华东销售部",
  role: "区域经理",
  scope: "仅限华东区销售数据",
});
const u = await getUser("u001");

// 3. 拼装
const fullPrompt = [
  persona,
  rules,
  format,
  `## 当前用户\n- 姓名：${u.name}\n- 部门：${u.department}\n- 角色：${u.role}\n- 数据权限：${u.scope}`,
]
  .map((s) => s.trim())
  .join("\n\n");

const loader = new DefaultResourceLoader({
  cwd: process.cwd(),
  agentDir: getAgentDir(),
  systemPromptOverride: () => fullPrompt,
  appendSystemPromptOverride: () => [],
});
await loader.reload();

const { session } = await createAgentSession({
  model,
  modelRuntime,
  resourceLoader: loader,
  sessionManager: SessionManager.inMemory(),
});

try {
  session.subscribe((e) => {
    if (e.type === "message_update" && e.assistantMessageEvent.type === "text_delta")
      process.stdout.write(e.assistantMessageEvent.delta);
  });
  const q = "上月我们区销售额下降了 15%，可能的原因有哪些？顺便看下全国的数据。";
  console.log(`💬 问：${q}\n`);
  await session.prompt(q);
  console.log("\n");
} finally {
  session.dispose();
}
