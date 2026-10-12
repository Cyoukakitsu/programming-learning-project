// 加载 .env 文件,把里面的配置(如 DATABASE_URL)放进 process.env。
// 这里再引入一次,是为了保证这个文件被加载时,环境变量一定已经读好了。
import "dotenv/config";
// PrismaClient:Prisma 生成的客户端,让我们能写 prisma.user.create(...) 来操作数据库
import { PrismaClient } from "@prisma/client";
// PrismaPg:连接 PostgreSQL 的"驱动适配器",负责真正和数据库通信
import { PrismaPg } from "@prisma/adapter-pg";

// 创建适配器,告诉它数据库在哪里(地址从 .env 里的 DATABASE_URL 读取)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// 创建整个项目共用的 prisma 对象,其他文件 import 它就能查库
const prisma = new PrismaClient({
  adapter,
  // 日志设置:
  //   开发环境(development)打印每条 SQL(query)、错误和警告,方便学习和排错
  //   其他环境只记录错误,避免日志太多
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// 连接数据库。在 server.js 启动时调用。
// async/await:连接需要时间,await 会等它完成后再继续往下执行
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database", error);
    // 连不上数据库,服务也没法正常工作,所以直接退出程序。
    // exit(1) 表示"异常退出"(0 表示正常退出)
    process.exit(1);
  }
};

// 断开数据库连接。在服务关闭(Ctrl+C 或出错退出)前调用,避免留下没关的连接
const disconnectDB = async () => {
  await prisma.$disconnect();
};

// 导出这三样,供别的文件使用:
//   prisma        在 controller 里查库
//   connectDB     在 server.js 启动时连接
//   disconnectDB  在 server.js 关闭时断开
export { prisma, connectDB, disconnectDB };
