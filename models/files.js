const {Schema, model} = require("mongoose")
const {randomBytes} = require("crypto")

// files expire after this many minutes
const EXPIRY_MINUTES = 15

const fileSchema = new Schema({
    // random id so other people's files cannot be guessed
    _id : {
        type : String,
        default : () => randomBytes(8).toString("hex"),
    },

    originalname : {
        type : String,
        required : true,
    },

    filename : {
        type : String,
        required : true,
    },

    path : {
        type : String,
        required : true,
    },

    createdAt : {
        type : Date,
        default : Date.now,
        expires : `${EXPIRY_MINUTES}m`
    },

})

const fileModel = new model("files", fileSchema)

module.exports = fileModel
module.exports.EXPIRY_MINUTES = EXPIRY_MINUTES