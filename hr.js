import express from "express"
import cors from "cors"
import sql from "mssql"

const config = {
	user: "sa",
	password: "123",
	server: "DESKTOP-IG5VSFM",
	database: "HR",
	encrypt: false,
}

const app = express()
app.use(cors())

app.get("/hr/Personal", (req, res) => {
	sql.connect(config)
		.then(() => {
			return sql.query("SELECT * FROM Personal")
		})
		.then((result) => {
			res.json(result.recordset)
		})
		.catch((err) => {
			console.log(err)
			res.sendStatus(500)
		})
})

app.listen(3000, () => {
	console.log("Server listening on port 3000")
})

export default app
