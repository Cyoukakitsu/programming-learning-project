import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, sep } from "node:path";
import { Type } from "typebox";
import {
  createAgentSession,
  defineTool,
  ModelRuntime,
  SessionManager,
} from "@earendil-works/pi-coding-agent";

const modelRuntime = await ModelRuntime.create();
const model = (await modelRuntime.getAvailable())[0];
if (!model) throw new Error("没有可用模型，请检查 ~/.pi/agent/models.json");

// resolve 会去掉结尾的 /，后面 notesDir + sep 才不会变成 "//"
const notesDir = resolve(fileURLToPath(new URL("./notes/", import.meta.url)));

// 数据访问：只读 notes 目录下的文件
async function readNote(path: string, maxChars = 2000, signal?: AbortSignal) {
  const full = resolve(notesDir, path);
  // 路径安全：解析后必须仍在 notes 目录内，挡住 ../ 越界
  if (!full.startsWith(notesDir + sep)) {
    throw new Error(`路径 "${path}" 超出 notes 目录，只能读取 notes 下的文件`);
  }
  let text: string;
  try {
    text = await readFile(full, { encoding: "utf8", signal });
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    // 错误里带上可用文件，LLM 才能自己修正
    const files = await readdir(notesDir);
    throw new Error(`文件 "${path}" 不存在。可用文件：${files.join("、")}`);
  }
  return text.length > maxChars
    ? `${text.slice(0, maxChars)}\n（已截断，原文共 ${text.length} 字符）`
    : text;
}

const readNoteTool = defineTool({
  name: "read_note",
  label: "读取笔记",
  description:
    "读取 notes 目录下的文本笔记，返回文件内容。只读，且只能访问 notes 目录内的文件。不确定文件名时可以先随便试一个，报错会列出所有可用文件。",
  parameters: Type.Object({
    path: Type.String({ description: "相对 notes 目录的文件名，如：todo.txt" }),
    maxChars: Type.Optional(Type.Number({ description: "最多返回字符数，默认 2000" })),
  }),
  async execute(_id, params, signal) {
    const text = await readNote(params.path, params.maxChars, signal);
    return { content: [{ type: "text", text }], details: {} };
  },
});

const { session } = await createAgentSession({
  model,
  modelRuntime,
  customTools: [readNoteTool],
  sessionManager: SessionManager.inMemory(),
});

// 白名单：只让 LLM 看到 read_note
session.setActiveToolsByName(["read_note"]);

try {
  session.subscribe((e) => {
    if (e.type === "tool_execution_start") console.log(`🔧 调用工具：${e.toolName}`);
    else if (e.type === "message_update" && e.assistantMessageEvent.type === "text_delta")
      process.stdout.write(e.assistantMessageEvent.delta);
  });
  const q = "9 月 1 日的会议讲了什么？";
  console.log(`💬 问：${q}\n`);
  await session.prompt(q);
  console.log("\n");
} finally {
  session.dispose();
}
