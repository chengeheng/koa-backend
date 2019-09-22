1. 添加中间件，格式化接口输出

-   首先单独创建一个 js，格式化代码输出格式

```javascript
// 在app.use(router)之前调用
var response_formatter = async (ctx, next) => {
	//先去执行路由
	await next();

	//如果有返回数据，将返回数据添加到data中
	if (ctx.body) {
		ctx.body = {
			code: 0,
			message: "success",
			data: ctx.body
		};
	} else {
		ctx.body = {
			code: 0,
			message: "success"
		};
	}
};

module.exports = response_formatter;
```

-   然后在 app.js 文件中引入，并在 app.use(router)之前调用

```javascript
const response_formatter = require("./middlewares/response_formatter");
// 添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter);
```

2. 连接数据库

    本次学习使用 monk 连接数据库

-   首先引入 monk const Monk = require("monk")
-   然后连接到库 const db = new Monk("localhost/study")
-   最后连接到表 const users = db.get("users")

即可以连接到 study 库中的 users，可以对 users 使用数据库方法

2. 连接数据库

    本次学习使用 monk 连接数据库

-   首先引入 monk const Monk = require("monk")
-   然后连接到库 const db = new Monk("localhost/study")
-   最后连接到表 const users = db.get("users")

即可以连接到 study 库中的 users，可以对 users 使用数据库方法
