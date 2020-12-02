# 项目生成

1. 安装 koa2 项目生成器并创建项目

```
npm install koa-generator -g
koa2 koa2-learn
```

生成框架目录如下

```
├── bin
├── config                  应用配置目录
│   ├── default.json        默认配置
│   └── production.json     生产环境配置
├── log                     日志目录
│   ├── app.log
│   └── error.log
├── router                  应用路由目录
│   ├── notes.js
│   ├── users.js
│   ├── index.js
├── public                  静态资源目录
├── utils                   工具函数文件
│   └── util.js
├── views                   html模板目录
│   └── test.html
├── app.js                  应用主文件
├── package-lock.json
├── package.json
├── README.md
└── yarn.lock

```

2. 进入 koa2-learn 安装依赖

```
npm install
```

3. 设置监听端口 在 app.js 中设置

```javascript
app.listen(3001, function() {
console.log(‘端口号 ========= 3001’);
});
```

4. 运行项目

```
npm start
```

5. 访问项目 http://localhost:3001/

# 遇到的问题

-   post 请求参数获取
-   history 页面刷新获取不到
-   数据库根据 id 查找不到数据
-   md 文档上传

# 常用中间件介绍

## koa-router

编写 nodejs 应用，首先想到的肯定是路由处理，koa-router 是 koa 的路由处理中间件，一个简单的根路由 get 请求处理：

```javascript
// router/index.js
const router = require("koa-router")();
// 前缀
router.prefix("/users");

router.get("/", () => {
	console.log(ctx.request.header);
	ctx.body = "here is home.";
});

module.exports = router;
```

然后还需要通过 app.use 语法调用这个中间件：

```javascript
index.js;

const Koa = require("koa");
const indexRouter = require("./router/index");

const app = new Koa();

app.use(indexRouter.routes());
app.listen(3000, () => {
	console.log("server is running at localhost:3000");
});
```

最后直接通过 node index.js 启动，就可以访问 localhost:3000/就能查看处理结果了~~

当然在项目中，某个路由的处理可能会很复杂，可以将路由处理的具体函数抽离到单独的 js 文件，比如说新建一个 controller 目录存放这类逻辑处理函数：

```javascript
// controller/index.js

module.exports = {
	index: (ctx, next) => {
		ctx.body = "here is home.";
	}
};
```

那么 router/index.js 就变成了：

```javascript
const router = require("koa-router")();
const homeController = require("../controller/index");

router.get("/", homeController.index);

module.exports = router;
```

如果你觉得 homeController.index 函数还是过于复杂，还可以抽离出一个 helper.js 放置一些工具函数等。反正尽量最大的做到函数单一职责，这样方便代码复用以及后期维护。

## koa-bodyparser

koa 将请求的参数以及返回的参数都封装到 ctx 对象当中，get 请求的数据可以通过 ctx.query 直接获取，但是 post 请求的数据则不行，需要使用 koa-bodyparser 解析 post 请求发送的 body 内容：

```javascript
const Koa = require("koa");
const app = new Koa();

const bodyParser = require("koa-bodyparser");

app.use(bodyParser());

app.listen(3000, () => {
	console.log("server is running at localhost:3000");
	console.log(process.env.NODE_ENV);
});
```

然后就可以从 ctx 对象中拿到 body 的具体内容了：

```javascript
// get获取数据
router.get("/get", async (ctx, next) => {
	const { name = "" } = ctx.query;
	let data = await users.find({
		userName: { $regex: name }
	});
	ctx.response.type = "application/json";
	ctx.body = data || [];
});
// post获取数据
router.post("/add", async (ctx, next) => {
	const { name = "", password = "" } = ctx.request.body;
	users.insert({
		userName: name,
		password: password
	});
	ctx.body = {
		message: "新增成功"
	};
});
```

## koa-static

koa-static 是 koa 的一个静态资源处理中间件，一般用它指定项目中的某个目录为静态资源目录，例如：

```javascript
const Koa = require("koa");
const path = require("path");
const app = new Koa();

const serve = require("koa-static");
app.use(serve(path.resolve(__dirname, "./static"))); // serve参数为静态文件目录

app.listen(3000, () => {
	console.log("server is running at localhost:3000");
	console.log(process.env.NODE_ENV);
});
```

这意味着你可以直接通过路由访问 static 文件夹下的资源，而不用专门去写路由处理函数，例如在 static 目录下有一个 css 文件为 test.css，你可以直接通过 localhost:3000/test.css 访问到文件内容。

## config

config 模块用来作为 node 项目配置文件的管理，一般配置文件分为开发、生产两种情况，在配置文件中你可以放置一些配置信息：

项目名称
版本号
数据库名称、域名、端口、账号、密码等
项目部署主机 ip
等等
使用 config 模块后，它会自动读取 config 文件夹下的 default.js 文件的配置信息(文件类型可以为 json，也可以是 yml)，还可以根据你项目所在环境读取其他文件内容作为 default.js 文件的覆盖，例如部署环境下启动项目：

```
corss-env NODE_ENV=production node index
```

它就会读取 production.js 文件覆盖 default.js 文件，获取配置信息时，config 模块提供了 get 方法直接获取，例如：

```javascript
// config/development.js
/**
 * 开发环境的配置内容
 */
module.exports = {
	env: "development", //环境名称
	host_port: 3001, //服务端口号
	mongodb_url: "", //数据库地址
	redis_url: "", //redis地址
	redis_port: "" //redis端口号
};

// config/test.js
/**
 * 测试环境的配置内容
 */
module.exports = {
	env: "test", //环境名称
	host_port: 3002, //服务端口号
	mongodb_url: "", //数据库地址
	redis_url: "", //redis地址
	redis_port: "" //redis端口号
};

// config/index.js
var development_env = require("./development");
var test_env = require("./test");
// 根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
	development: development_env,
	test: test_env
}[process.env.NODE_ENV || "development"];

// 根据启动项的配置不同，这边config会调用不同的文件
// app.js
const Koa = require("koa");
const config = require("config");

const app = new Koa();
const port = config.get("host_port");

app.listen(port, () => {
	console.log(`server is running at localhost:${port}`);
	console.log(process.env.NODE_ENV);
});
```

这样就可以在配置文件指定的端口启动项目了

## connect-history-api-fallback

单页面应用程序(SPA)通常使用一个 web 浏览器可以访问的索引文件，比如 index.html，然后，在 HTML5 History API 的帮助下（react-router 就是基于 History API 实现的），借助 JavaScript 处理应用程序中的导航。

当用户单击刷新按钮或直接通过输入地址的方式访问页面时，会出现找不到页面的问题，因为这两种方式都绕开了 History API，而我们的请求又找不到后端对应的路由，页面返回 404 错误。

connect-history-api-fallback 中间件很好的解决了这个问题。具体来说，每当出现符合以下条件的请求时，它将把请求定位到你指定的索引文件(默认为/index.html)。

-   请求是 Get 请求
-   请求的 Content-Type 类型是 text/html 类型
-   不是直接的文件请求，即所请求的路径不包含.(点)字符
-   不匹配 option 参数中提供的模式

在项目中使用 connect-history-api-fallback 时，现在 middlewares 下新建一个文件，引入 connect-history-api-fallback:

```javascript
const history = require("connect-history-api-fallback");
module.exports = options => {
	const middleware = history(options);
	const noop = () => {};

	return async (ctx, next) => {
		middleware(ctx, null, noop);
		await next();
	};
};
```

然后将这个方法导入到 app.js 中，在引入其他中间件之前引用：

```javascript
const connectHistory = require("./middlewares/koa2-connect-history-api-fallback");

app.use(
	connectHistory({
		htmlAcceptHeaders: ["text/html", "application/xhtml+xml"],
		rewrites: [{ from: /\/soccer/, to: "/soccer.html" }] // 正则匹配
	})
);
```

## 连接 mongo 数据库

### 1. mongoose

连接数据库：

```javascript
const mongoose = require("mongoose");
// 获取数据库的本机地址
const DB_URL = "mongodb://127.0.0.1:27017/infos";
// const DB_URL = "mongodb://username:password@127.0.0.1:27017/infos";
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, { useMongoClient: true });
mongoose.connection.on("connected", () => {
	console.log("mongodb数据库连接成功");
});
mongoose.connection.on("error", error => {
	console.log("mongodb数据库连接失败", error);
});
module.exports = mongoose;
```

数据库集合里面的每张表需要先定义好字段及其类型：

```javascript
const mongoose = require("mongoose");
const db = require("./connect.js");
const userSchema = new mongoose.Schema({
	name: { type: String },
	number: { type: Number },
	email: { type: String },
	password: { type: String },
	rePassword: { type: String }
});
let userModel = db.model("user", userSchema);
module.exports = userModel;
```

最终导出的即为定义好的数据表。数据表可以对数据库进行增删改查，如：

```javascript
const doc = {
	name: "张三",
	number: 15812345678,
	email: "123@134.com",
	password: "123456",
	rePassword: "123456"
};

userModel.create(doc, function(err, docs) {
	if (err) {
		console.log("create error: " + err);
		return;
	}
	console.log("create success:\n " + docs);
});
```

### 2. monk

连接数据库

```javascript
const monk = require("monk");
const db = monk("localhost:27017/monk-demo");
const users = db.get("users");
```

monk 不需要对数据类型进行检查，它会把数据直接插入到数据库的表中，如果没有这个字段，则会创建一个

```javascript
// 插入数据
users.insert({
	name: "张三",
	number: 15812345678,
	email: "123@134.com",
	password: "123456",
	rePassword: "123456"
});
// 查找数据
users.find({ name: "张三" }, function(err, docs) {
	console.log(docs);
});
```

monk 的 find 方法不支持模糊匹配，模糊匹配可以通过正则的方式来实现：

```javascript
// 获取数据通过正则模糊匹配
router.get("/get", async (ctx, next) => {
	const { name = "" } = ctx.query;
	let data = await users.find({
		userName: { $regex: name }
	});
	ctx.response.type = "application/json";
	ctx.body = data || [];
});
```
