import express from "express";

// Router:一个"迷你路由器",专门管一组网址。
// 在 server.js 里用 app.use("/movies", movieRoutes) 挂载,
// 所以下面写的 "/" 实际对应的完整网址是 /movies
const router = express.Router();

// 目前这里只是占位:先把四种 HTTP 方法跑通,返回一句固定的话,
// 还没有连接数据库。以后会换成真正的增删改查。
// (req, res) => {...} 是处理函数:req 是收到的请求,res 用来回复。

// GET /movies:查。以后会改成"返回电影列表"
router.get("/", (req, res) => {
  res.json({ httpMethod: "get" });
});

// POST /movies:增。以后会改成"添加一部电影"
router.post("/", (req, res) => {
  res.json({ httpMethod: "post" });
});

// PUT /movies:改。以后会改成"修改一部电影"(通常还会带上电影 id)
router.put("/", (req, res) => {
  res.json({ httpMethod: "put" });
});

// DELETE /movies:删。以后会改成"删除一部电影"(通常还会带上电影 id)
router.delete("/", (req, res) => {
  res.json({ httpMethod: "delete" });
});

// 导出 router,server.js 会引入并挂载它
export default router;
