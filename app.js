require('dotenv').config()
const express = require("express")
const connectDatabase = require("./connection")
const path = require("path")
const fileRouter = require("./routes/files")

console.log("MONGO_URL received:", process.env.MONGO_URL ? "YES" : "NOT SET")
connectDatabase(process.env.MONGO_URL)
    .then(() => console.log("Database Connected!"))
    .catch((err) => console.log("Error in Database Connection!", err.message))

const app = express()
const PORT = process.env.PORT || 8000

app.use(express.urlencoded({extended : false}))

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use("/", fileRouter)

app.listen(PORT, () => console.log(`server is listening at port ${PORT}`))

// incase of invalid path
app.use((req, res) => {
    return res.end("Page not found!")
})