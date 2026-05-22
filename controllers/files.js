const fileModel = require("../models/files")
const path = require("path")
const fs = require("fs")

function handleShowHomepage(req, res) {
    return res.status(200).render("home")
}

function handleShowUploadPage(req, res) {
    return res.status(200).render("upload")
}

function handleShowDownloadPage(req, res) {
    return res.status(200).render("download")
}

async function handleFileUpload(req, res) {
    // case when there will be no file
    if (!req.file) {
        return res.status(400).render("upload", {
            message: "Please Choose a File"
        })
    }

    // storing data in the database
    let createdFile = await fileModel.create({
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
    })

    let fileId = createdFile._id.toString()

    return res.status(201).render("home", {
        id: fileId,
        message : "File Uploaded! The File will be removed from server after 15 mins!"
    })
}

async function handleFileSearchAndDownload(req, res) {
    try {
        const { id } = req.body

        if (!id) {
            return res.status(400).render("download", {
                message: "Please Enter Id"
            })
        }

        // space trim
        const trimId = id.trim()
        if (trimId.length === 0) {
            return res.render("download", {
                message: "Please Enter Valid ID!"
            })
        }

        const requiredFile = await fileModel.findById(trimId)
       
        // incase no file found
        if (!requiredFile) {
            return res.status(404).render("download", {
                message: "no file found with this id"
            })
        }

        // incase file found
        try{
            const filePath = path.resolve(requiredFile.path)

            // checking if the file exists on the disk
            if(!fs.existsSync(filePath)){
                return res.render("download", {
                    message : "File not Found!"
                })
            }

            return res.download(filePath, requiredFile.originalname)
        }
        catch(err){
            return res.render("download", {
                message : "File not Found!"
            })
        }
    }
    catch(err){
        return res.status(400).render("Download", {
            message : "No File exists with this ID!"
        })
    }

}

module.exports = {
    handleShowHomepage,
    handleShowDownloadPage,
    handleShowUploadPage,
    handleFileUpload,
    handleFileSearchAndDownload,
}