const { Router } = require("express")
const { handleShowHomepage, handleShowDownloadPage, handleShowUploadPage, handleFileUpload, handleFileSearchAndDownload } = require("../controllers/files")
const multer = require('multer')
const router = Router()

// multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const maxSize = 10 * 1024 * 1024

const upload = multer({ storage: storage, limits: { fileSize: maxSize } })

router.get("/", handleShowHomepage)
router.get("/upload", handleShowUploadPage)
router.post("/upload", (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).render("upload", {
          message: `File is too large! Maximum limit is ${maxSize / (1024 * 1024)}MB.`
        })
      }
      // incase of any other error
      return res.status(400).render("upload", {
        message : err.message,
      });
    }

    // incase file size is valid
    handleFileUpload(req, res);
  });
});
router.get("/download", handleShowDownloadPage)
router.post("/download", handleFileSearchAndDownload)

module.exports = router