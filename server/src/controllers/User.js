const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userObj = user.toObject({ virtuals: true });

    return res.status(200).json({
      message: "User fetch successful",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const id  = req.user.id;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userObj = user.toObject({ virtuals: true });

    return res.status(200).json({
      message: "User updated successfully",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateUserByEmail = async (req, res) => {
  try {
    const email = req.body.email;
    const { password, ...updateData } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "email is required to update a user",
      });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const showAllUser = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const getAll= async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteOneUser = async (req, res) => {
  try {
    const userEmail  = req.body.email;

    await User.findOneAndDelete({email:userEmail});
  
    return res.status(200).json({
      message: "User delete successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = { getUser, updateUser, showAllUser, getAll, deleteOneUser, updateUserByEmail };