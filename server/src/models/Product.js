
const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        default:""

    },
    description:{
        type:String,
        required:true,
        default:""

    },
    photo: {
            type: String,
            alias: "productImg",
            default: "",
    }


})

module.exports = mongoose.model("Product", productSchema);