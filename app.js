require('dotenv').config()
const express = require("express")
const connectDatabase = require("./connection")
const path = require("path")
const fileRouter = require("./routes/files")
const createLogs = require("./middlewares/logs")
const startCleanup = require("./cleanup")
const fs = require("fs")

// make sure uploads folder exists and remove expired files from it
fs.mkdirSync(path.resolve("./uploads"), { recursive: true })
startCleanup(path.resolve("./uploads"))

connectDatabase(process.env.MONGO_URL)
    .then(() => console.log("Database Connected!"))
    .catch(() => console.log("Error in Database Connection!"))

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.urlencoded({extended : false}))
app.use(createLogs("./logs.txt"))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use("/", fileRouter)

// incase of invalid path
app.use((req, res) => {
    return res.status(404).end("Page not found!")
})

app.listen(PORT, () => console.log(`server is listening at port ${PORT}`))