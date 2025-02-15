module.exports = (req, res, next) => {
  // 拦截登录请求
  if (req.method === 'POST' && req.url === '/login') {
    const { username, password } = req.body;

    // 模拟数据库查询（实际应从 db.json 读取）
    const users = require('./db.json').users;
    const user = users.find(
      u => u.username === username && u.password === password
    );

    // 模拟响应
    if (user) {
      res.status(200).json({ token: user.token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    next(); // 其他请求继续走默认路由
  }
};