const router = require("koa-router")();
const UserController = require("../controllers/users");
// 前缀
router.prefix("/users");

// 管理员验证
router.post("/check", UserController.adminCheck);
// 获取数据接口
router.get("/loadData", UserController.getUserList);
// 登录验证
router.post("/login", UserController.userLogin);

// 增加数据接口
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

// 删除数据接口
router.post("/remove", async ctx => {
	const { id = "" } = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 400,
			message: "id不能为空"
		};
		return;
	}
	let data = await users.findOneAndDelete({ _id: id });
	if (data) {
		ctx.body = {
			message: "删除成功"
		};
	} else {
		ctx.response.status = 400;
		ctx.body = {
			code: 400,
			message: "删除失败"
		};
	}
});

// 修改数据接口
router.post("/update", async ctx => {
	const { id = "", ...rest } = ctx.request.body;
	if (!id) {
		ctx.body = {
			code: 400,
			message: "id不能为空"
		};
		return;
	}
	let data = await users.findOneAndUpdate(
		{ _id: id },
		{
			$set: {
				...rest
			}
		}
	);
	if (data) {
		ctx.body = {
			message: "更新成功"
		};
	} else {
		ctx.response.status = 400;
		ctx.body = {
			code: 400,
			message: "更新失败"
		};
	}
});

module.exports = router;
