# 电影清单后端:6 步学习路线

这是一个电影清单(Watchlist)后端 API:用户可以注册登录、添加电影、把电影放进自己的清单并标记状态。

后端工程师拿到项目的顺序是:**先想数据,再搭地基,再连数据库,然后启动服务,最后写接口和逻辑。** 点击下面的链接可以直接跳到对应代码。

## 总览

| 步骤 | 做什么 | 对应文件 |
|---|---|---|
| [第 1 步](#第-1-步设计数据) | 设计数据 | [schema.prisma](prisma/schema.prisma)、[migrations/](prisma/migrations/) |
| [第 2 步](#第-2-步搭地基) | 搭地基 | [package.json](package.json)、[.env](.env)、[prisma.config.ts](prisma.config.ts) |
| [第 3 步](#第-3-步连接数据库) | 连接数据库 | [db.js](src/config/db.js) |
| [第 4 步](#第-4-步启动服务) | 启动服务 | [server.js](src/server.js) |
| [第 5 步](#第-5-步规划网址路由) | 规划网址(路由) | [movieRoutes.js](src/routes/movieRoutes.js)、[authRoutes.js](src/routes/authRoutes.js) |
| [第 6 步](#第-6-步写业务逻辑) | 写业务逻辑 | [authController.js](src/controllers/authController.js) |

```
想清楚数据 → 装工具配环境 → 连数据库 → 启动服务 → 规划网址 → 写逻辑
```

