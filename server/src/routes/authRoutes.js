const express = require("express");
const router = express.Router();

const LoginController = require("../controllers/Login");
const RegisterController = require("../controllers/Register");
const deleteUser = require("../controllers/DeleteUser");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

router.post("/register", RegisterController.register);
router.post("/login", LoginController.Login);
router.post("/verify-email", RegisterController.verifyEmail);
router.post("/resend-verification", RegisterController.resendVerificationCode);
router.post("/logout", auth, LoginController.logout);
router.delete("/:id", auth, deleteUser);


router.post(
  "/upload",
  auth,
  upload.single("file"),
  RegisterController.uploadImg
);


module.exports = router;
