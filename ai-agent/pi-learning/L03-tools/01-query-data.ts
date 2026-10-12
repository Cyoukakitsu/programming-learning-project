import { readFile } from "node:fs/promises";
import { Type } from "typebox";
import {
  createAgentSession,
  defineTool,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

// 1.初始化模型
const modelRuntime = await ModelRuntime.create();
const model = (await modelRuntime.getAvailable())[0];
if (!model) throw new Error("没有可用模型，请检查 ~/.pi/agent/models.json");


// 数据访问：读 CSV + 按条件过滤
const ops: Record<string, (a: string, b: string) => boolean> = {
  "=": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  ">": (a, b) => Number(a) > Number(b),
  "<": (a, b) => Number(a) < Number(b),
  ">=": (a, b) => Number(a) >= Number(b),
  "<=": (a, b) => Number(a) <= Number(b),
  contains: (a, b) => a.includes(b),
};

// querySales：读 sales.csv + 按条件过滤
async function querySales(column: string, operator: string, value: string, limit = 20) {
  const [head, ...lines] = (await readFile(new URL("./sales.csv", import.meta.url), "utf8"))
    .trim()
    .split("\n");
  const cols = head.split(",");
  const idx = cols.indexOf(column);
  // 错误要抛异常（框架据此标 isError），且写清怎么改，LLM 才会自己修正
  if (idx < 0) throw new Error(`列 "${column}" 不存在。可用列：${cols.join("、")}`);
  const rows = lines.filter((l) => ops[operator](l.split(",")[idx], value)).slice(0, limit);
  return [head, ...rows].join("\n") + `\n（共 ${rows.length} 行）`;
}

// ① 说明书 + ② 干活：一个 defineTool = 一个工具
const queryDataTool = defineTool({
  name: "query_data",
  label: "查询销售数据",
  description:
    "查询销售数据（sales.csv）。按指定列的条件过滤，返回匹配的行。字段：日期、产品、地区、销售额、数量、销售人员。仅查询，不能修改数据。",
  parameters: Type.Object({
    column: Type.String({ description: "要过滤的列名，如：地区、产品、销售人员、销售额" }),
    operator: Type.Union(
      ["=", "!=", ">", "<", ">=", "<=", "contains"].map((o) => Type.Literal(o)),
      { description: "比较运算符：= != > < >= <= contains" },
    ),
    value: Type.String({ description: "过滤条件的值" }),
    limit: Type.Optional(Type.Number({ description: "最多返回行数，默认 20" })),
  }),
  async execute(_id, params) {
    const text = await querySales(params.column, params.operator, params.value, params.limit);
    return { content: [{ type: "text", text }], details: {} };
  },
});

// ③ 注册
const { session } = await createAgentSession({
  model,
  modelRuntime,
  customTools: [queryDataTool],
  sessionManager: SessionManager.inMemory(),
});

// 白名单：只让 LLM 看到 query_data，藏掉 bash/write/edit/read
session.setActiveToolsByName(["query_data"]);

try {
  session.subscribe((e) => {
    if (e.type === "tool_execution_start") console.log(`🔧 调用工具：${e.toolName}`);
    else if (e.type === "message_update" && e.assistantMessageEvent.type === "text_delta")
      process.stdout.write(e.assistantMessageEvent.delta);
  });
  const q = "华东地区一共多少销售额？";
  console.log(`💬 问：${q}\n`);
  await session.prompt(q);
  console.log("\n");
} finally {
  session.dispose();
}
