const router = require("koa-router")();
var fs = require("fs");
var marked = require("marked");

const ejs = require("ejs");
var showdown = require("showdown"),
	converter = new showdown.Converter();

converter.setOption("tables", true);

router.prefix("/notes");

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css">
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
    <link rel="stylesheet" href="/css/doc.css">
</head>
<body>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="#"> Markdown</a>
        </div>
        <button type="button" class="btn btn-primary navbar-btn navbar-right" id="download"><span class="glyphicon glyphicon-download-alt"></span> Download</button>
      </div>
    </nav>
    <div class="container" id="doc-page">
        <%- doc %>
    </div>
    <div class="footer">
        <span>© 2017 Gavin</span>
    </div>
</body>
</script>
</html>`;

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

// 获取数据接口
router.get("/get", async (ctx, next) => {
	// const paths = await fs.readdir("bin/notes");
	// const files = await Promise.all(
	// 	paths.map(path => fs.readFile(`docs/${path}`, "utf8"))
	// );

	// ctx.type = "markdown";
	// ctx.body = files.join("");

	let buffer = await readFile("bin/notes/backend_notes.md");
	// let body = converter.makeHtml(buffer.toString());
	let htmlStr = marked(buffer.toString());
	// ctx.render(template, { doc: htmlStr });
	ctx.body = ejs.render(template, {
		doc: htmlStr
	});
});

module.exports = router;
