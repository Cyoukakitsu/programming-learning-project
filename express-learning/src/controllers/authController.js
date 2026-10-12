// prisma:操作数据库的对象(见 config/db.js)
import { prisma } from "../config/db.js";
// bcrypt:密码哈希工具。数据库里不存明文密码,只存哈希后的结果
import bcrypt from "bcrypt";

// 注册。路由 POST /auth/register 会调用它。
// req 是收到的请求,res 是用来回复的对象。
// async:函数里有 await(等数据库、等加密),所以要写 async
const register = async (req, res) => {
  // 从请求体里取出前端发来的三个字段(req.body 由 express.json() 解析得到)
  const { name, email, password } = req.body;

  // 第 1 步:按邮箱查数据库,看这个邮箱是否已经注册过。
  // findUnique 只能用在带 @unique 的列上(email 在 schema 里就是 @unique)
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // 已经存在就不能重复注册,返回 400(请求有问题)。
  // return 的作用是在这里结束函数,后面的代码不再执行
  if (userExists) {
    return res.status(400).json({});
  }

  // 第 2 步:把密码变成哈希。
  // salt(盐)是一段随机数据,混进密码里,使相同的密码也会得到不同的哈希。
  // 10 是计算强度:数字越大越安全,但也越慢
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 第 3 步:把用户写进数据库。注意存的是 hashedPassword,不是原密码
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 第 4 步:返回结果。201 表示"创建成功"。
  // 返回里故意不带 password,哪怕是哈希也不应该给前端
  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: name,
        email: email,
      },
    },
  });
};

// 登录。路由 POST /auth/login 会调用它
const login = async (req, res) => {
  const { email, password } = req.body;

  // 按邮箱找用户。找不到时 user 是 null
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // 邮箱和密码错误返回同一信息,避免泄露用户是否存在
  // 这一行的意思:user 存在,并且输入的密码与数据库里的哈希匹配,才算通过。
  // 哈希不能还原成原密码,所以 bcrypt.compare 是把输入的密码用同样方法再算一遍,看结果是否一致。
  // 如果 user 是 null,&& 会直接短路,不会去执行后面的 compare
  const valid = user && (await bcrypt.compare(password, user.password));
  // 没通过就返回 401(未通过身份验证)
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // 登录成功,返回 200。目前只返回用户信息,还没有签发 JWT 登录凭证(后续可以补上)
  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  });
};

// 导出这两个函数,authRoutes.js 会引入它们并绑定到网址上
export { register, login };
