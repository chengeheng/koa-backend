// 笔记相关的controller
// 引入service文件
const NoteService = require("../services/notes");

module.exports = {
	getNoteList: async (ctx, next) => {
		let data = await NoteService.getNoteList();
		ctx.response.type = "application/json";
		ctx.body = { data };
	},
	getNoteListOrderByYear: async (ctx, next) => {
		let data = await NoteService.getNoteListOrderByYear();
		ctx.response.type = "application/json";
		ctx.body = { data };
	},
	getNoteDetail: async (ctx, next) => {
		let { id } = ctx.query;
		let data = await NoteService.getNoteDetail(id);
		ctx.response.type = "application/json";
		ctx.body = { data };
	},
	getNoteText: async (ctx, next) => {
		let { id = "" } = ctx.query;
		let data = await NoteService.getNoteText(id);
		if (data) {
			ctx.body = { data };
		} else {
			ctx.response.status = 400;
			ctx.body = {
				message: "文件不存在",
				code: 400
			};
		}
	},
	addNewNote: async (ctx, next) => {
		const {
			name = "",
			type = "",
			createTime = "",
			author = ""
		} = ctx.request.body;
		let params = {
			name,
			type,
			createTime,
			author
		};
		await NoteService.addNewNote(params);
		ctx.body = {
			message: "新增成功"
		};
	},
	updateNote: async (ctx, next) => {
		const {
			name = "",
			type = "",
			createTime = "",
			author = "",
			id = ""
		} = ctx.request.body;
		let params = {
			name,
			type,
			createTime,
			author,
			id
		};
		await NoteService.getNoteText(params);
		ctx.body = {
			message: "新增成功"
		};
	},
	uploadNoteFile: async (ctx, next) => {
		// 上传单个文件
		// 可能不是读的files.file，会根据前台传的字段不同而改变
		const file = ctx.request.files.file;
		await NoteService.uploadNoteFile(file);
		ctx.body = {
			message: "上传成功！",
			data: {
				name: file.name
			}
		};
	},
	updateNoteFile: async (ctx, next) => {
		const file = ctx.request.files.file;
		// 删除单个文件
		await NoteService.deleteNoteFile(file.name);
		await NoteService.uploadNoteFile(file);
		ctx.body = {
			message: "修改成功！",
			data: {
				name: file.name
			}
		};
	}
};
