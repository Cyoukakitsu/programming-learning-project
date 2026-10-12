// express:搭建后端服务的框架
import express from "express";
// dotenv 的 config 函数:读取 .env 文件里的配置
import { config } from "dotenv";
// 自己写的数据库连接/断开函数(见 config/db.js)
import { connectDB, disconnectDB } from "./config/db.js";

// 自己写的两组路由:电影相关、登录注册相关
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// 启动准备:先读取 .env 配置,再连接数据库
config();
connectDB();

// 创建应用。可以把 app 想成"餐厅本身",后面所有规则都挂在它上面
const app = express();

// 中间件:请求进来后先经过这里,像"安检口"。
// express.json() 把请求体里的 JSON 文本解析成对象,放进 req.body。
// 没有它,controller 里的 req.body 会是 undefined。
app.use(express.json());
// 同理,这一行用于解析网页表单提交的数据
app.use(express.urlencoded({ extended: true }));

// 挂载路由:按网址前缀把请求分给不同的路由文件。
// 例如 authRoutes 里的 "/register",完整网址就是 /auth/register
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

// 端口:一台电脑上可以同时跑很多程序,端口就是区分它们的"门牌号"
const PORT = 5001;
// 开始监听端口,等待请求进来。访问 http://localhost:5001 就能找到这个服务。
// 把返回值存进 server,是为了下面关闭服务时用
const server = app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});

// ===== 下面三段是应对意外情况的"优雅退出":先收拾干净,再退出 =====

// 异步操作(如查数据库)出错,而且没有任何地方处理它
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  // 先停止接收新请求,等手头的请求处理完,再断开数据库并退出
  server.close(async () => {
    await disconnectDB();
    process.exit(1); // 1 表示异常退出
  });
});

// 同步代码抛出了错误,而且没有被捕获,程序已经处于不可靠状态,直接清理后退出
process.on("uncaughtException", async (error) => {
  console.error("Uncaught Exception:", error);
  await disconnectDB();
  process.exit(1);
});

// 你在终端按下 Ctrl+C。这是正常的关闭,所以退出码是 0
process.on("SIGINT", async () => {
  console.log("SIGINT signal received");
  server.close(async () => {
    await disconnectDB();
    process.exit(0); // 0 表示正常退出
  });
});
