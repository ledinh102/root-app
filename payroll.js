import mysql from "mysql"
import express from "express"

const app = express()

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "123456",
	database: "payroll",
})

connection.connect((err) => {
	if (err) {
		console.log("Error connecting to MySQL database:", err)
		return
	}
	console.log("Connected to MySQL database.")
})

app.route("/springapp/employee").get((req, res) => {
	const query = "SELECT * FROM employee"
	connection.query(query, (err, rows) => {
		if (err) {
			console.log("Error executing query:", err)
			return
		}
		res.send(rows)
	})
})

app.listen(3001, () => {
	console.log("Server listening on port 3001")
})

export default app
