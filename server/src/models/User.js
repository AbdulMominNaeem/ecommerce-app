const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
        },
        password:{
            type:String,
            required: true,
            minLength: 6,
        },
        phone:{
            type:String,
            default:""
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
            default: null,
        },
        verificationCodeExpires: {
            type: Date,
            default: null,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        }
    
    },
        {
            timestamps: true
        }

    
)
module.exports = mongoose.model("User", userSchema);