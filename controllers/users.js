// 笔记相关的controller
// 引入service文件
const UserService = require("../services/users");
module.exports = {
	adminCheck: async (ctx, next) => {
		const { name = "", password = "" } = ctx.request.body;
		let data = await UserService.adminCheck(name, password);
		if (data) {
			ctx.body = { role: data };
		} else {
			ctx.response.status = 401;
			ctx.body = {
				role: "guest",
				code: 401,
				message: "用户没有权限"
			};
		}
	},
	getUserList: async (ctx, next) => {
		const { name = "" } = ctx.query;
		let data = await UserService.getUserList(name);
		ctx.response.type = "application/json";
		ctx.body = { data };
	},
	userLogin: async (ctx, next) => {
		const { name = "", password = "" } = ctx.request.body;
		let res = await UserService.userLogin(name, password);
		if (res) {
			ctx.body = {
				message: "登录成功"
			};
		} else {
			ctx.response.status = 401;
			ctx.body = {
				code: 401,
				message: "登录失败"
			};
		}
	}
};
