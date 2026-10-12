import express from "express";
// 引入 controller 里真正干活的函数(见 controllers/authController.js)
import { register, login } from "../controllers/authController.js";

// 迷你路由器。在 server.js 里用 app.use("/auth", authRoutes) 挂载,
// 所以下面的路径前面都要加上 /auth
const router = express.Router();

// 路由文件只负责"指路":哪个网址交给哪个函数,自己不写业务逻辑。
// 这样看路由文件就像看菜单,一眼知道应用有哪些功能。

// POST /auth/register:注册。用 POST 是因为要提交数据(邮箱、密码)
router.post("/register", register);
// POST /auth/login:登录。登录也用 POST,避免把密码放进网址里
router.post("/login", login);

// 导出 router,server.js 会引入并挂载它
export default router;
