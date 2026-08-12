const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Login = async(req,res)=>{

    try{

        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json({
                message:"Please fill all required fileds"
            })
        }
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }

        if (!user.isVerified) {
            return res.status(401).json({
                message: "Email is not verified. Please verify your email before logging in.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        user.password = undefined;

        const token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({
            message:"Login successful",
            token,
            user
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

const logout = async(req,res)=>{

    try{

        const user = req.user;
        res.json({
            message:"Logout successful",
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




module.exports = {Login, logout};