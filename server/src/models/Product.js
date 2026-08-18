
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
    photo: {
            type: String,
            alias: "productImg",
            default: "",
    }, 
    category:{
        type: Schema.Types.ObjectId,
        required:false,
        ref: 'Category'
    }


})

module.exports = mongoose.model("Product", productSchema);