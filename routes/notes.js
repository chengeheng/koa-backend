const router = require("koa-router")();
var fs = require("fs");
var ObjectId = require("mongodb").ObjectID;
// 连接数据库
const Monk = require("monk");
const db = new Monk("blogadmin:422611@122.51.190.152:27017/blog"); //链接到库
const notes = db.get("notes"); //表

router.prefix("/notes");
// 读取文件函数
let readFile = function(path) {
	return new Promise((res, rej) => {
		fs.readFile(path, (err, content) => {
			if (err) {
				rej(err);
			}
			res(content);
		});
	});
};

// 获取文档相关内容
router.get("/get", async (ctx, next) => {
	let { id = "" } = ctx.query;
	let hex = /[0-9A-Fa-f]{6}/g;
	id = hex.test(id) ? ObjectId(id) : id;
	let data = await notes.find({
		_id: id
	});
	ctx.response.type = "application/json";
	ctx.body = { data: data[0] || {} };
});

// 获取文档相关内容
router.get("/list", async (ctx, next) => {
	let data = await notes.find();
	ctx.response.type = "application/json";
	ctx.body = { data: data || [] };
});

// 获取单个文档
router.get("/detail/get", async (ctx, next) => {
	let { id = "" } = ctx.query;
	let hex = /[0-9A-Fa-f]{6}/g;
	id = hex.test(id) ? ObjectId(id) : id;
	let data = await notes.find({
		_id: id
	});
	if (data && data[0]) {
		let { name, type } = data[0];
		let buffer = await readFile(`public/notes/${name}.${type}`);
		ctx.body = { data: buffer.toString() };
		ctx.code = 200;
	} else {
		ctx.code = 4001;
	}
});

// 新增文档相关信息
router.post("/add", async (ctx, next) => {
	const {
		name = "",
		type = "",
		summary = "",
		createTime = "",
		author = ""
	} = ctx.request.body;
	notes.insert({
		userName: name,
		type: type,
		summary: summary,
		createTime: createTime,
		author: author
	});
	ctx.body = {
		message: "新增成功"
	};
});
// 上传文档接口
router.post("/detail/add", async (ctx, next) => {
	// 上传单个文件
	console.log(ctx.request.files);
	const file = ctx.request.files.file;
	// 创建可读流
	const reader = fs.createReadStream(file.path);
	// 创建可写流
	const upStream = fs.createWriteStream("public/notes/" + `/${file.name}`);
	// 可读流通过管道写入可写流
	reader.pipe(upStream);
	ctx.body = {
		message: "上传成功！",
		data: {
			name: file.name
		}
	};
});

module.exports = router;
