let express = require("express")
let bodyParser = require("body-parser")
let morgan = require("morgan")
let uuidv4 = require("uuid/v4")
let date = require("date-and-time")

let app = express()

app.use(express.static("public"))
app.use(morgan("dev"))
app.use("/blog-post", bodyParser.urlencoded())
app.use("/blog-post", bodyParser.json())

let blogposts_db = [
	{
		id: uuidv4(),
		title: "Who uses blogs anymore?",
		content: "Why bother? there's better sites out there, don't @ me.",
		author: "saltyboi_420",
		publishDate: date.format(new Date(), 'DD-MM-YYYY HH:mm')
	},
	{
		id: uuidv4(),
		title: "I love blogging",
		content: "Blogging is so much fun",
		author: "blogger-lover",
		publishDate: date.format(new Date(), 'DD-MM-YYYY HH:mm')
	}
]

app.get("/blog-posts", (req, res, next) => {
	return res.status(200).json(blogposts_db)
})

app.get("/blog-post", (req, res, next) => {
	let author = req.query.author
	let match = []

	if (author == null){
		return res.status(406).json({
			code: 406,
			message: "Missing author field in url"
		})
	}

	blogposts_db.forEach(function(elem, idx) {
		if (elem.author == author)
			match.push(elem)
	})

	if (match.length == 0){
		return res.status(404).json({
			code: 404,
			message: `Author '${author}' not found`
		})
	}

	return res.status(200).json(match)
})

app.post("/blog-posts", (req, res, next) => {
	let title = req.body.title
	let content = req.body.content
	let author = req.body.author
	let now = date.format(new Date(), 'DD-[MM]-YYYY HH:mm')

	if (title == null || content == null || author == null){
		return res.status(406).json({
			code: 406,
			message: "Missing parameters in post"
		})
	}

	let post = {
		id: uuidv4(),
		title: title,
		content: content,
		author: author,
		publishDate: now
	}

	blogposts_db.push(post)
	return res.status(201).json({
		code: 201,
		message: "Post succesful"
	})
})

app.delete("/blog-posts", (req, res, next) => {
	let id = req.query.id

	blogposts_db.forEach(function(elem, idx) {
		if (elem.id == id) {
			blogposts_db.splice(idx, 1)

			return res.status(200).json({
				code:200,
				message: `Removed post id:${id}`
			})
		}
	})

	return res.status(404).json({
		code: 404,
		message: `Post id:${id} not found.`
	})
})

app.put("/blog-posts", (res, req, next) => {
	console.log(req.body)
	let id = req.body.id
	let title = req.body.title
	let content = req.body.content
	let author = req.body.author

	if (id == null) {
		return res.status(406).json({
			code: 406,
			message: "Missing parameters in post"
		})
	}

	let post_idx
	blogposts_db.forEach(function(elem, idx) {
		if (elem.id == id){
			post_idx = idx
		}
	})
	if (title != null)
		blogposts_db[post_idx].title = title
	if (content != content)
		blogposts_db[post_idx].content = content
	if (author != null)
		blogposts_db[post_idx].author = author

	return res.status(202).json(post)

})

app.listen("8080", () => {
	console.log("App running on localhost:8080")
})