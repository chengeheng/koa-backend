const router = require("koa-router")();

// 引入相关controller
const NoteController = require("../controllers/notes");
router.prefix("/notes");
// 获取文档列表
router.get("/list", NoteController.getNoteList);
router.get("/listOrderByYear", NoteController.getNoteListOrderByYear);
// 获取文档详情
router.get("/get", NoteController.getNoteDetail);
// 获取文档内容
router.get("/detail/get", NoteController.getNoteText);
// 新增文档相关信息
router.post("/add", NoteController.addNewNote);
// 修改文档相关信息
router.post("/update", NoteController.updateNote);

// 上传文档接口
router.post("/detail/add", NoteController.uploadNoteFile);
// 删除文档接口
router.post("/detail/update", NoteController.updateNoteFile);

module.exports = router;
