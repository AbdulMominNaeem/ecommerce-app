const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../services/email.service");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password || !email || !name) {
      return res.status(400).json({
        message: "Please fill out all fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({
        message: "User already exists. Please verify your email if needed.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateVerificationCode();

    const verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
      avatar: null,
    });

    await user.save();

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Email verification code</h2>
          <p>Hi ${name},</p>
          <p>Your verification code is:</p>

          <p style="
            font-size: 24px;
            font-weight: bold;
          ">
            ${verificationCode}
          </p>

          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Regards,<br/>The Team</p>
        </div>
      `,
    });

    return res.status(201).json({
      message: "User registered. Verification code sent to email.",
      email,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email already verified.",
      });
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code.",
      });
    }

    if (
      user.verificationCodeExpires &&
      user.verificationCodeExpires < new Date()
    ) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Email verified successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified.",
      });
    }

    const verificationCode = generateVerificationCode();

    user.verificationCode = verificationCode;

    user.verificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendEmail({
      to: email,
      subject: "Resend verification code",
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px;">
          <h2>Email verification code</h2>

          <p>Your new verification code is:</p>

          <p style="
            font-size: 24px;
            font-weight: bold;
          ">
            ${verificationCode}
          </p>

          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Verification code resent successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const uploadImg = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    user.avatar = avatarUrl;

    await user.save();

    return res.status(200).json({
      message: "Photo successfully saved.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register: Register,
  verifyEmail,
  resendVerificationCode,
  uploadImg,
};