const router = require("koa-router")();
const Monk = require("monk");
const db = new Monk("localhost/study"); //链接到库
const users = db.get("users"); //表
const utils = require("./../utils/utils");
router.prefix("/users");

router.get("/", function(ctx, next) {
    ctx.body = "this is a users response!";
});

router.get("/bar", function(ctx, next) {
    console.log(ctx.query);
    ctx.body = "this is a users/bar response";
});

// 获取数据接口
router.get("/loadData", async (ctx, next) => {
    const { name = "", age = "" } = ctx.query;
    let data = await users.find({
        name: { $regex: name },
        age: { $regex: age }
    });
    ctx.response.type = "application/json";
    ctx.body = data || [];
});
// 增加数据接口
router.post("/add", async (ctx, next) => {
    const { name = "", age = "" } = ctx.request.body;
    users.insert({
        name: name,
        age: age
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
    let data = await users.find({ _id: id });
    if (data.length < 1) {
        ctx.response.status = 400;
        ctx.body = {
            code: 400,
            message: "删除失败，id不存在"
        };
    } else {
        users.remove({ _id: id });
        ctx.body = {
            message: "删除成功"
        };
    }
});

module.exports = router;
