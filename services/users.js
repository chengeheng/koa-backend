// 用户相关的service
const Monk = require("monk");
const db = new Monk("blogadmin:422611@122.51.190.152:27017/blog", {
	useUnifiedTopology: true
}); //链接到库
const users = db.get("users"); //表
module.exports = {
	adminCheck: async (name, password) => {
		let data = await users.find({
			userName: name,
			password: password
		});
		if (data.length > 0) {
			return data[0].role;
		} else {
			return null;
		}
	},
	getUserList: async name => {
		let data = await users.find({
			userName: { $regex: name }
		});
		return datas;
	},
	userLogin: async (name, password) => {
		let data = await users.find({
			userName: { $regex: name }
		});
		return data.length > 0 && data[0].password === password;
	}
};
