/**
 * 在app.use(router)之前调用
 */
var response_formatter = async (ctx, next) => {
	//先去执行路由
	await next();

	//如果有返回数据，将返回数据添加到data中
	console.log("type:", ctx.type);
	if (ctx.body) {
		const { message = "success", code = 200, ...rest } = ctx.body;
		ctx.body = {
			code: code,
			message: message,
			...rest
		};
	}
};

module.exports = response_formatter;
