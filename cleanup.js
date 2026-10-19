const fs = require("fs")
const path = require("path")
const { EXPIRY_MINUTES } = require("./models/files")

// mongodb ttl only removes the record, so expired files are removed from disk here
function startCleanup(dir){
    const expiryTime = EXPIRY_MINUTES * 60 * 1000

    function removeExpiredFiles(){
        fs.readdir(dir, (err, files) => {
            if(err){
                return console.log("error while reading uploads folder")
            }

            files.forEach((file) => {
                if(file === ".gitkeep") return

                const filePath = path.join(dir, file)
                fs.stat(filePath, (err, stats) => {
                    if(err) return

                    // incase file is older than expiry time
                    if(Date.now() - stats.mtimeMs > expiryTime){
                        fs.unlink(filePath, () => {})
                    }
                })
            })
        })
    }

    removeExpiredFiles()
    setInterval(removeExpiredFiles, 60 * 1000)
}

module.exports = startCleanup
