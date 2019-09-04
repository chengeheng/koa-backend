const router = require("koa-router")();
const Monk = require("monk");
const db = new Monk("localhost/study"); //链接到库
const users = db.get("users"); //表
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
});

module.exports = router;
