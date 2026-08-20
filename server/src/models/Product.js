
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    price:{
        type: Number,
        required:true,

    },
    photo: {
            type: String,
            alias: "productImg",
            default: "",
    }, 
    category:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Category'
    }


})

module.exports = mongoose.model("Product", productSchema);