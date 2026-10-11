// 1.导入
import {
  createAgentSession,
  ModelRuntime,
} from "@earendil-works/pi-coding-agent";

// 2.加载配置
const modelRuntime = await ModelRuntime.create();

// 3.选模型
const available = await modelRuntime.getAvailable();
const model = available[0];

if (!model) {
  console.error("❌ 没找到可用模型，请检查 ~/.pi/agent/models.json");
  process.exit(1);
}

// 4.建会话
const { session } = await createAgentSession({ model, modelRuntime });


try {
  // ⑤ 订阅事件
  session.subscribe((event) => {
    if (
      event.type === "message_update" &&
      event.assistantMessageEvent.type === "text_delta"
    ) {
      process.stdout.write(event.assistantMessageEvent.delta);
    }
  });

  console.log(`🤖 使用模型：${model.provider}/${model.id}\n`);

  // ⑥ 发问
  await session.prompt("用一句话介绍你自己。");
  console.log("\n");
} finally {
  // ⑦ 清理
  session.dispose();
}
