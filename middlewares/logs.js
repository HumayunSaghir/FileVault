const fs = require("fs")

function createLogs(pathname){
    return (req, res, next) => {
        const data = `new request recieved at ${req.path} by method ${req.method}`

        fs.appendFile(pathname, data, (err) => {
            if(err){
                console.log("error while appending data to the file")
            }
        })

        next()
    }
}

module.exports = createLogs