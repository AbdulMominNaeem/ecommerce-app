const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const UserController = require("../controllers/User");

router.get("/",auth, UserController.getUser);
router.put("/",auth, UserController.updateUser);
router.get("/all", admin, UserController.getAll);
router.delete("/delete", admin, UserController.deleteOneUser);
router.put("/updatebyemail",admin, UserController.updateUserByEmail);


module.exports = router;