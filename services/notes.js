// 仅存放数据相关的操作，业务相关的逻辑都存放在controller中
const fs = require("fs");
const ObjectId = require("mongodb").ObjectID;
// 连接数据库
const Monk = require("monk");
const db = new Monk("blogadmin:422611@122.51.190.152:27017/blog", {
	useUnifiedTopology: true
}); //链接到库
const notes = db.get("notes"); //表

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
let listToTree = function(list) {
	let map = [];
	list.forEach(item => {
		if (map.indexOf(item.year) < 0) {
			map.push(item.year);
		}
	});
	map.sort((a, b) => b - a);
	let res = [];
	map.map(item => {
		let tmp = list.filter(item2 => item2.year === item);
		res.push({
			year: item,
			children: tmp
		});
	});
	res = res.map(item => {
		item.children.sort((a, b) => b.createTime - a.createTime);
		return item;
	});
	return res;
};
module.exports = {
	getNoteList: async _ => {
		let data = await notes.find();
		return data;
	},
	getNoteListOrderByYear: async _ => {
		let data = await notes.find();
		data = data.map(item => ({
			...item,
			year: new Date(item.createTime).getFullYear()
		}));
		return listToTree(data);
	},
	getNoteDetail: async id => {
		if (id.length !== 24) return null;
		let hex = /[0-9A-Fa-f]{6}/g;
		id = hex.test(id) ? ObjectId(id) : id;
		let data = await notes.find({
			_id: id
		});
		return data[0] || {};
	},
	getNoteText: async id => {
		if (id.length !== 24) return null;
		let hex = /[0-9A-Fa-f]{24}/g;
		id = hex.test(id) ? ObjectId(id) : id;
		let data = await notes.find({
			_id: id
		});
		if (data && data[0]) {
			let { name, type } = data[0];
			let buffer = await readFile(`public/notes/${name}.${type}`);
			return buffer.toString();
		} else {
			return null;
		}
	},
	addNewNote: async params => {
		const { name, type, createTime, author } = params;
		notes.insert({
			name: name,
			type: type,
			createTime: createTime,
			author: author
		});
	},
	updateNote: async params => {
		const { name, type, summary, createTime, author, id } = params;
		if (id.length !== 24) return null;
		let hex = /[0-9A-Fa-f]{24}/g;
		id = hex.test(id) ? ObjectId(id) : id;
		users.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					name: name,
					type: type,
					summary: summary,
					createTime: createTime,
					author: author
				}
			}
		);
	},
	uploadNoteFile: async file => {
		// 创建可读流
		const reader = fs.createReadStream(file.path);
		// 创建可写流
		const upStream = fs.createWriteStream("public/notes/" + `${file.name}`);
		// 可读流通过管道写入可写流
		reader.pipe(upStream);
	},
	deleteNoteFile: async name => {
		// 删除本地文件
		fs.unlinkSync("public/notes/" + name);
	}
};
