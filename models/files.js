const {Schema, model} = require("mongoose")

const fileSchema = new Schema({
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
        expires : '15m'
    },
    
})

const fileModel = new model("files", fileSchema)

module.exports = fileModel