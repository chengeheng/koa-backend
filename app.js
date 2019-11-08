const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
// const logger = require("koa-logger");
const koaBody = require("koa-body");
const index = require("./routes/index");
const users = require("./routes/users");
const notes = require("./routes/notes");
const connectHistory = require("./middlewares/koa2-connect-history-api-fallback");
// 1. 错误处理
// error handler
// onerror(app, options);
onerror(app);

// 2. 中间件加载
// middlewares
// 解释：app.use 加载用于处理http請求的middleware（中间件），当一个请求来的时候，会依次被这些 middlewares处理。

app.use(
	connectHistory({
		htmlAcceptHeaders: ["text/html", "application/xhtml+xml"]
	})
);

app.use(
	koaBody({
		multipart: true,
		formidable: {
			maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
		},
		jsonLimit: "50mb",
		formLimit: "50mb",
		textLimit: "50mb"
	})
);
app.use(json());
// app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
	views(__dirname + "/views", {
		extension: "pug"
	})
);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 添加格式化处理响应结果的中间件，在添加路由之前调用
const response_formatter = require("./middlewares/response_formatter");
app.use(response_formatter);
// routes
// 加载路由中间件
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(notes.routes(), notes.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
	console.error("server error", err, ctx);
});

app.listen(8030);

module.exports = app;
