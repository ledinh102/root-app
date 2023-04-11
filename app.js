import express from "express"
import bodyParser from "body-parser"
import HR from "./hr.js"
import PAYROLL from "./payroll.js"

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("assets"))

app.get("/", (req, res) => {
	res.render("home")
})

function fetchData(port, address) {
	const requestOptions = {
		method: "GET",
		redirect: "follow",
	}
	return fetch(`http://localhost:${port}/${address}`, requestOptions)
		.then((response) => response.json())
		.then((result) => {
			return result
		})
		.catch((error) => console.log("error", error))
}

app.get("/api/staff", async (req, res) => {
	const dataHRPersonal = await fetchData(3000, "hr/Personal")
	const dataSpringappEmployee = await fetchData(3001, "springapp/employee")
	console.log(dataHRPersonal.length)
	console.log(dataSpringappEmployee.length)
	const mergedData = []

	dataHRPersonal.forEach((personal) => {
		const employee = dataSpringappEmployee.find(
			(employee) => employee.Employee_Number === personal.Employee_ID
		)
		const mergedObj = {
			...personal,
			...(employee
				? {
						idEmployee: employee.idEmployee,
						Pay_Rate: employee.Pay_Rate,
						PayRates_id: employee.PayRates_id,
						Vacation_Days: employee.Vacation_Days,
						Paid_To_Date: employee.Paid_To_Date,
						Paid_Last_Year: employee.Paid_Last_Year,
				  }
				: {
						idEmployee: null,
						Pay_Rate: null,
						PayRates_id: null,
						Vacation_Days: null,
						Paid_To_Date: null,
						Paid_Last_Year: null,
				  }),
		}
		mergedData.push(mergedObj)
	})

	dataSpringappEmployee.forEach((employee) => {
		const personal = dataHRPersonal.find(
			(personal) => personal.Employee_ID === employee.Employee_Number
		)
		if (!personal) {
			const mergedObj = {
				Employee_ID: employee.Employee_Number,
				idEmployee: employee.idEmployee,
				First_Name: employee.First_Name,
				Last_Name: employee.Last_Name,
				Social_Security_Number: employee.SSN,
				Middle_Initial: null,
				Address1: null,
				Address2: null,
				City: null,
				State: null,
				Benefit_Plans: null,
				Zip: null,
				Ethnicity: null,
				Email: null,
				Phone_Number: null,
				Drivers_License: null,
				Marital_Status: null,
				Gender: null,
				Shareholder_Status: null,
				Pay_Rate: employee.Pay_Rate,
				PayRates_id: employee.PayRates_id,
				Vacation_Days: employee.Vacation_Days,
				Paid_To_Date: employee.Paid_To_Date,
				Paid_Last_Year: employee.Paid_Last_Year,
			}
			mergedData.push(mergedObj)
		}
	})
	res.send(mergedData)
})

app.get("/Staff", async (req, res) => {
	const data = await fetchData(3002, "api/staff")
	res.render("staff", { title: "Staff", data: data })
})

app.listen(3002, () => {
	console.log("Server listening on port 3002")
})
